import { supabase } from "@/lib/supabase";

import type { Session } from "@supabase/supabase-js";
import type { UserData, Reward } from "@/types/helpers";
import type { Account } from "@/types/basiq";

import { BACKEND_URL } from "@env";

function makeAuthenticatedGetRequest(path: string, session: Session) {
    return fetch(`${BACKEND_URL}/${path}/${session.user.id}`, {
        method: 'GET',
        headers: {
            token: session.access_token,
        }
    }) 
}

export async function fetchUserData(): Promise<UserData> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        console.log('user not logged in')
        throw new Error('User not logged in');
    }

    return await makeAuthenticatedGetRequest('get-user', session)
    .then((res) => res.json());
}

export async function refreshUserData(): Promise<boolean> {
    // check if user has new data
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    return await makeAuthenticatedGetRequest('refresh-user', session)
    .then((res) => res.json())
    .then(({ hasNewData }) => hasNewData);
}

export async function fetchUserAccounts(): Promise<Account[]> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    return await makeAuthenticatedGetRequest('get-user-accounts', session)
    .then((res) => res.json())
    .then(({ data }) => data);
}

export async function redeemReward(reward: Reward): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    return await makeAuthenticatedGetRequest('redeem-reward', session)
    .then((res) => res.status === 200)
    .catch((e) => {
        console.log(e);
        return false;
    });
}

export async function deleteUserAccount() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    const { data } = await makeAuthenticatedGetRequest('delete-user', session)
    .then((res) => res.json());

    // log user out
    supabase.auth.signOut();
}