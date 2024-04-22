import { supabase } from "@/lib/supabase";
import { getBasiqServerAccessToken } from "@/lib/basiq";

import type { Session } from "@supabase/supabase-js";

import type { ResolvedPromise } from "@/types/helpers";
import type { Transaction } from "@/types/basiq";

async function fetchUserTransactionsData(BasiqUserId: string | null): Promise<Transaction[]> {
    if (!BasiqUserId) return [];
    // get Basiq access token
    const BasiqServerAccessToken = await getBasiqServerAccessToken();

    return fetch(`https://au-api.basiq.io/users/${BasiqUserId}/transactions?limit=50`, {
        headers: {
            'Authorization': `Bearer ${BasiqServerAccessToken}`,
            'Accept': 'application/json',
        }
    })
    .then((res) => res.json())
    .then((res) => res.data);
}

export async function fetchUserData(session: Session | null) {
    // fetch Supabase user
    const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', '1e29fa1b-1c03-4099-8f2e-63bb3ef0ae2a'); // TODO: insert actual user id!!

    if (error) {
        console.log(error);
        throw new Error(`Error fecthing data ${error}`);
    };

    // fetch transactions data from Basiq
    const transactions = await fetchUserTransactionsData(data[0]['basiq_user_id']);

    return {
        ...data[0],
        transactions
    };
}

export type UserData = NonNullable<ResolvedPromise<ReturnType<typeof fetchUserData>>>;