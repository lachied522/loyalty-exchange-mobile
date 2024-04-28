
import { supabase } from "@/lib/supabase";

import type { UserData } from "./crud";

import { BACKEND_URL } from "@env";

export async function fetchUserData(): Promise<UserData> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        console.log('user not logged in')
        throw new Error('User not logged in');
    }

    console.log(`${BACKEND_URL}/api/get-user`);

    return await fetch(
        `http://192.168.1.104:3000/api/get-user`,
        {
            method: 'GET',
            headers: {
                'token': session.access_token,
            }
        }
    )
    .then((res) => res.json());
}

export async function refreshUserData(): Promise<boolean> {
    // check if user has new data
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    return await fetch(
        `http://192.168.1.104:3000/api/refresh-user`,
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