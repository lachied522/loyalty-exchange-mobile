import { supabase } from "@/lib/supabase";

import { fetchUserTransactions } from "./transactions";

import type { TablesInsert, TablesUpdate } from "@/types/supabase";
import type { ResolvedPromise } from "@/types/helpers";

export async function fetchUserData() {
    // get user session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    // fetch data from Supabase
    const { data, error } = await supabase
    .from('users')
    .select('*, points(*, stores(*, reward_types(*))), rewards(*, reward_types(*)), transactions(*)')
    .eq('id', session.user.id);

    if (error) {
        console.log(error);
        throw new Error(`Error fecthing user data ${error}`);
    };

    // fetch transactions data from Basiq
    const recentTransactions = await fetchUserTransactions(data[0]['basiq_user_id'], 10);

    // filter out transactions based on time last updated
    const lastUpdated = new Date(data[0].last_updated);
    const newTransactions = recentTransactions.filter((transaction) => new Date(transaction.postDate) > lastUpdated);

    return {
        ...data[0],
        newTransactions
    };
}

export async function updateUserRecord(record: TablesUpdate<'users'>) {
    // get user session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    const { data, error } = await supabase
    .from('users')
    .update(record)
    .eq('id', session.user.id)
    .select('*, points(*), rewards(*), transactions(*)'); 
    
    if (error) {
        console.log(`Error updating user record: `, error);
        throw new Error(`Error updating user record ${error}`);
    };

    return data;
}

export async function fetchStoresById(stores: string[]) {
    const { data, error } = await supabase
    .from('stores')
    .select('*, reward_types(*)')
    .in('id', stores);

    if (error) {
        console.log(`Error fecthing store data ${error}`);
    };

    return data;
}

export async function fetchStoresByVendorName(vendorNames: string[]) {
    const { data, error } = await supabase
    .from('stores')
    .select('id, vendor_name, points_rate, reward_types(*)')
    .in('vendor_name', vendorNames);

    if (error) {
        console.log(`Error fecthing store data ${error}`);
        throw new Error(`Error fecthing store data ${error}`);
    };

    return data;
}

export async function insertTransactions(records: TablesInsert<'transactions'>[]) {
    const { error } = await supabase
    .from('transactions')
    .insert(records);

    if (error) {
        console.log(`Error inserting transactions:`, error);
        throw new Error(`Error inserting transactions ${error}`);
    };
}

export async function upsertPointsRecords(records: Omit<TablesInsert<'points'>, 'user_id'>[]) {
    // get user session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    // add user user id to records
    const newRecords = records.map((record) => ({ 
        ...record,
        user_id: session.user.id
    }));

    const { error } = await supabase
    .from('points')
    .upsert(newRecords, { onConflict: 'user_id, store_id' });

    if (error) {
        console.log(`Error updating points balance: `, error);
        throw new Error(`Error updating points balance ${error}`);
    };
}

export async function updateRewardRecord(record: TablesUpdate<'rewards'>) {
    const { error } = await supabase
    .from('rewards')
    .update(record)
    .eq('id', record.id!);

    if (error) {
        console.log(`Error updating reward: `, error);
        throw new Error(`Error updating reward ${error}`);
    };
}

export type UserData = NonNullable<ResolvedPromise<ReturnType<typeof fetchUserData>>>;
export type StoreData = NonNullable<ResolvedPromise<ReturnType<typeof fetchStoresById>>>[number];