import {
    fetchUserData,
    fetchStoresByVendorName,
    insertTransactions,
    updatePointsBalanceAtStore,
    updateUserPointsBalance
} from "./crud";

import type { Transaction } from "@/types/basiq";
import type { TablesInsert } from "@/types/supabase";

const POINTS_CONVERSION_RATE = 10;

export async function createTransactionRecords(
    transactions: Transaction[],
    userID: string
) {
    // create new transaction records by merging transactions from Basiq api with store data and user ID
    if (transactions.length === 0) return [];

    // get records for relevant stores
    const stores = await fetchStoresByVendorName(transactions.map((transaction) => transaction.description.toLowerCase()));
    
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

export async function refresh() {
    // update user points balances based on recent transactions
    // this should be done on the server

    // Step 1: fetch user data
    const data = await fetchUserData();

    // Step 2: create records for any new transactions
    const newTransactions = await createTransactionRecords(data.newTransactions, data.id);

    // Step 3: updating points balance for each store
    let totalSpend = 0;
    const pointsMap = new Map<string, number>();
    for (const transaction of newTransactions) {
        totalSpend += Math.abs(transaction.amount!);
        pointsMap.set(transaction.store_id, (pointsMap.get(transaction.store_id) || 0) + transaction.points!);
    }

    console.log(pointsMap);

    const promises = Array.from(pointsMap).map(async ([store, balance]) => {
        return await updatePointsBalanceAtStore(store, balance);
    });

    // step 4: update points balance in user record
    promises.push(updateUserPointsBalance(data.points_balance + totalSpend * POINTS_CONVERSION_RATE));

    // Step 5: insert records for new transactions
    promises.push(insertTransactions(newTransactions));

    await Promise.all(promises);
}

export async function redeemReward() {
    return
}