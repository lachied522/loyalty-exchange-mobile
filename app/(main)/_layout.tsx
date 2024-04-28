import { useEffect, useState } from 'react';
import { Stack } from "expo-router";

import { fetchUserData, type UserData } from '@/utils/crud';

import { useGlobalContext, type GlobalState } from '@/context/GlobalContext';

import LoadingScreen from './loading-screen';
import MainContextProvider from "./context/MainContext";

export default function MainLayout() {
    const { session } = useGlobalContext() as GlobalState;
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = false;

        loadData().then(() => setIsLoaded(true));

        async function loadData() {
            if (!isMounted) {
              // fetch user data
              const data = await fetchUserData();
              // update state
              setUserData(data);
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