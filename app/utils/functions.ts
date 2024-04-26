import {
    fetchUserData,
    fetchStoresByVendorName,
    insertTransactions,
    upsertPointsRecords,
    updateUserRecord,
    updateRewardRecord,
    type UserData,
    type StoreData
} from "./crud";

import { fetchUserTransactions } from "./transactions";

import type { Transaction } from "@/types/basiq";
import type { TablesInsert } from "@/types/supabase";
import type { Reward } from "@/types/helpers";


export async function fetchAppData() {
    // step 1: fetch user data
    const userData = await fetchUserData();

    // step 2: check if any recent transactions
    const recentTransactions = await fetchUserTransactions(userData['basiq_user_id'], 10);

    // step 3: filter out transactions based on time last updated
    const lastUpdated = new Date(userData.last_updated);
    const newTransactions = recentTransactions.filter((transaction) => new Date(transaction.postDate) > lastUpdated);

    // step 4: populate store data

    return {
        ...userData,
        newTransactions
    };
}

export async function createTransactionRecords(
    transactions: Transaction[],
    userID: string
) {
    // create new transaction records by merging transactions from Basiq api with store data and user ID
    if (transactions.length === 0) return [];

    // get records for relevant stores
    const stores = await fetchStoresByVendorName(transactions.map((transaction) => transaction.description.toUpperCase()));
    
    function reducer(acc: TablesInsert<'transactions'>[], obj: Transaction) {
        const store = stores.find((store) => store.vendor_name === obj.description);

        if (!store) return acc;

        // calculate points
        const points = Math.abs(parseFloat(obj.amount)) * store.points_rate;

        return [
            ...acc,
            {
                amount: parseFloat(obj.amount),
                date: obj.postDate,
                points: points,
                store_id: store.id,
                user_id: userID
            }
        ]
    }

    return transactions.reduce(reducer, []);
}

export async function refreshUserData() {
    // update user points balances based on recent transactions
    // this should be done on the server

    // Step 1: fetch user data
    const data = await fetchUserData();

    // Step 2: create records for any new transactions
    const newTransactions = await createTransactionRecords(data.newTransactions, data.id);

    if (newTransactions.length === 0) return false; // nothing to do

    // Step 3: sum points balance for each store
    let totalSpend = 0;
    const pointsMap = new Map<string, number>();
    for (const transaction of newTransactions) {
        totalSpend += Math.abs(transaction.amount!);
        pointsMap.set(transaction.store_id, (pointsMap.get(transaction.store_id) || 0) + transaction.points!);
    }

    const promises = [];
    // Step 4: upsert points records for each store
    promises.push(upsertPointsRecords(
        Array.from(pointsMap).map(([store, balance]) => ({
            balance,
            store_id: store,
        }))
    ));

    // Step 5: insert records for new transactions
    promises.push(insertTransactions(newTransactions));

    // step 6: update user points balance and last_updated columns
    const POINTS_CONVERSION_RATE = 10;
    promises.push(updateUserRecord({
        points_balance: data.points_balance + totalSpend * POINTS_CONVERSION_RATE,
        last_updated: new Date().toISOString(),
    }));

    await Promise.all(promises);
    
    return true;
}

export async function setRewardRedeemed(reward: Reward, userData: UserData) {
    // Step 1: set redeemed column to true
    await updateRewardRecord({
        id: reward.id,
        redeemed: true,
        redeemed_at: new Date().toISOString(),
    });

    // Step 2: adjust user's points balance
    const newBalance = userData.points_balance - (reward.reward_types?.cost || 0);
    return await upsertPointsRecords([{
        balance: newBalance,
        store_id: reward.reward_types!.store_id,
    }]);
}

export async function convertToStorePoints(newPointsBalance: number, newStorePointsBalance: number, store_id: string) {
    // convert LoyaltyExchange points to Store Points
    const promises = [];

    promises.push(upsertPointsRecords([{
        balance: newStorePointsBalance,
        store_id: store_id,
    }]));

    promises.push(updateUserRecord({
        points_balance: newPointsBalance,
    }));

    await Promise.all(promises);

    return true;
}