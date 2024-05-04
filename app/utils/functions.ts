import { supabase } from "@/lib/supabase";

import type { UserData, Reward } from "@/types/helpers";
import type { Account } from "@/types/basiq";

import { BACKEND_URL } from "@env";

export async function fetchUserData(): Promise<UserData> {
    const { data: { session } } = await supabase.auth.getSession();

    console.log(BACKEND_URL);

    if (!session) {
        console.log('user not logged in')
        throw new Error('User not logged in');
    }

    return await fetch(
        `${BACKEND_URL}/get-user/${session.user.id}`,
        {
            method: 'GET',
            headers: {
                'token': session.access_token,
            }
        }
    )
    .then((res) => res.json())
    .catch((e) => console.log(e));
}

export async function refreshUserData(): Promise<boolean> {
    // check if user has new data
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    return await fetch(
        `${BACKEND_URL}/refresh-user/${session.user.id}`,
        {
            method: 'GET',
            headers: {
                'token': session.access_token,
            }
        }
    )
    .then((res) => res.json())
    .then(({ hasNewData }) => hasNewData);
}

export async function fetchUserAccounts(): Promise<Account[]> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    return await fetch(
        `${BACKEND_URL}/get-user-accounts/${session.user.id}`,
        {
            method: 'GET',
            headers: {
                'token': session.access_token,
            }
        }
    )
    .then((res) => res.json())
    .then(({ data }) => data);
}

export async function redeemReward(reward: Reward): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    return await fetch(
        `${BACKEND_URL}/redeem-reward/${reward.id}`,
        {
            method: 'GET',
            headers: {
                'token': session.access_token,
            }
        }
    )
    .then((res) => res.status === 200)
    .catch((e) => {
        console.log(e);
        return false;
    });
}