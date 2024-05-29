import { supabase } from "@/lib/supabase";

import { NotLoggedInError, FetchError } from "./errors";

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

    const res = await fetch(
        url,
        {
            method: 'GET',
            headers: {
                token: session.access_token,
            }
        }
    );

    if (!res.ok) {
        throw new FetchError();
    }

    return await res.json();
}

export async function fetchUserData(): Promise<UserData> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new NotLoggedInError();
    }

    if (session.user.is_anonymous) {
        return {
            id: '',
            name: 'Guest',
            basiq_user_id: null,
            points_balance: 0,
            last_updated: '',
            points: [],
            redeemed: [],
            transactions: [],
        };
    }

    return await makeAuthenticatedGetRequest(
        'get-user',
        session.user.id,
        session
    );
}

export async function refreshUserData(): Promise<{
    hasNewData: boolean,
    data: UserData | null,
}> {
    // check if user has new data
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new NotLoggedInError();
    }

    return await makeAuthenticatedGetRequest(
        'refresh-user',
        session.user.id,
        session
    );
}

export async function fetchUserAccounts(): Promise<Account[]> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new NotLoggedInError();
    }

    if (session.user.is_anonymous) {
        return [];
    }

    return await makeAuthenticatedGetRequest(
        'get-user-accounts',
        session.user.id,
        session
    )
    .then(({ data }) => data);
}

export async function redeemReward(reward: Reward): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new NotLoggedInError();
    }

    return await makeAuthenticatedGetRequest(
        'redeem-reward',
        reward.id,
        session
    );
}

export async function deleteUserAccount() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new NotLoggedInError();
    }

    const res = await makeAuthenticatedGetRequest('delete-user', session.user.id, session);

    // log user out
    supabase.auth.signOut();
}