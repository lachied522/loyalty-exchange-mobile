import { useEffect, useState } from 'react';
import { Stack } from "expo-router";

import { fetchUserData } from '~/app/utils/functions';
import type { UserData } from '@/types/helpers';

import LoadingScreen from './loading-screen';
import MainContextProvider from "./context/MainContext";

export default function MainLayout() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = false;

        loadData().then(() => setIsLoaded(true));

        async function loadData() {
            if (!isMounted) {
              // fetch user data
              const data = await fetchUserData()
              .catch((e) => console.log(e));
              // update state
              if (data) setUserData(data);
            }
            // prevent effect from running again
            isMounted = true;
        }
    }, []);

    if (!(isLoaded && userData)) return <LoadingScreen />;

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