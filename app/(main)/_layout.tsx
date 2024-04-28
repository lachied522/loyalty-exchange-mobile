import { useEffect, useState } from 'react';
import { Stack } from "expo-router";

import type { Session } from '@supabase/supabase-js';

import { fetchUserData, type UserData } from '@/utils/crud';

import { useGlobalContext, type GlobalState } from '@/context/GlobalContext';

import MainContextProvider from "./context/MainContext";

export default function MainLayout() {
    const { session } = useGlobalContext() as GlobalState;
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = false;

        newSession(session);

        async function newSession(session: Session | null) {
            if (!isMounted) {
              // fetch user data
              const data = await fetchUserData();
              // update state
              setUserData(data);
            }
            // set isLoaded state to true
            setIsLoaded(true);
            // prevent effect from running again
            isMounted = true;
        }
    }, [session]);

    if (!(isLoaded && userData)) return null;

    return (
        <MainContextProvider initialState={userData}>
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />
            <Stack />
        </MainContextProvider>
    )
}