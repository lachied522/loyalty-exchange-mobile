import { supabase } from "@/lib/supabase";

import { fetchUserTransactions } from "./transactions";

import type { Session } from "@supabase/supabase-js";

import type { TablesInsert } from "@/types/supabase";
import type { ResolvedPromise } from "@/types/helpers";

export async function fetchUserData() {
    // get user session
    // const { data: { session } } = await supabase.auth.getSession();

    // if (!session) {
    //     throw new Error('User not logged in');
    // }

    // fetch data from Supabase
    const { data, error } = await supabase
    .from('users')
    .select('*, points(*), rewards(*), transactions(*)')
    .eq('id', '1e29fa1b-1c03-4099-8f2e-63bb3ef0ae2a'); 

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

export async function updateUserPointsBalance(balance: number) {
    // get user session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    const { error } = await supabase
    .from('users')
    .update({ points_balance: balance })
    .eq('id', session.user.id);
    
    if (error) {
        console.log(`Error fecthing updating points balance ${error}`);
        throw new Error(`Error fecthing updating points balance ${error}`);
    };
}

export async function fetchStoreData(storeID: string) {
    const { data, error } = await supabase
    .from('stores')
    .select('*, reward_types(*)')
    .eq('id', storeID);

    if (error) {
        console.log(`Error fecthing store data ${error}`);
    };

    return data? data[0]: data;
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
        console.log(`Error fecthing updating points balance ${error}`);
        throw new Error(`Error fecthing updating points balance ${error}`);
    };
}

export async function updatePointsBalanceAtStore(store_id: string, balance: number) {
    // get user session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    const { error } = await supabase
    .from('points')
    .update({ balance })
    .eq('user_id', session.user.id)
    .eq('store_id', store_id!);

    if (error) {
        console.log(`Error fecthing updating points balance ${error}`);
        throw new Error(`Error fecthing updating points balance ${error}`);
    };
}

export type UserData = NonNullable<ResolvedPromise<ReturnType<typeof fetchUserData>>>;
export type StoreData = NonNullable<ResolvedPromise<ReturnType<typeof fetchStoreData>>>;