import { supabase } from "@/lib/supabase";

import type { Session } from "@supabase/supabase-js";
import type { UserData, Reward } from "@/types/helpers";
import type { Account } from "@/types/basiq";

async function makeAuthenticatedGetRequest(
    path: string,
    slug: string,
    session: Session
) {

    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/${path}` + (
        slug.length? `/${slug}`: ''
    );

    return await fetch(
        url,
        {
            method: 'GET',
            headers: {
                token: session.access_token,
            }
        }
    )
    .then((res) => res.json());
}

export async function fetchUserData(): Promise<UserData> {
    const { data: { session } } = await supabase.auth.getSession();

    console.log(process.env.EXPO_PUBLIC_BACKEND_URL);

    if (!session) {
        console.log('user not logged in')
        throw new Error('User not logged in');
    }

    return await makeAuthenticatedGetRequest('get-user', session.user.id, session);
}

export async function refreshUserData(): Promise<boolean> {
    // check if user has new data
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    return await makeAuthenticatedGetRequest('refresh-user', session.user.id, session)
    .then(({ hasNewData }) => hasNewData);
}

export async function fetchUserAccounts(): Promise<Account[]> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    return await makeAuthenticatedGetRequest('get-user-accounts', session.user.id, session)
    .then(({ data }) => data);
}

export async function redeemReward(reward: Reward): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    return await makeAuthenticatedGetRequest('redeem-reward', reward.id, session);
}

export async function deleteUserAccount() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    const res = await makeAuthenticatedGetRequest('delete-user', session.user.id, session);

    // log user out
    supabase.auth.signOut();
}