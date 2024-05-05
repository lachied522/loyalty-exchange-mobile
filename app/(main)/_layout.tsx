import { useEffect, useState } from 'react';
import { Stack } from "expo-router";
import { useToast } from 'react-native-toast-notifications';

import type { UserData } from '@/types/helpers';
import { fetchUserData } from '@/utils/functions';

import LoadingScreen from './loading-screen';
import MainContextProvider from "./context/MainContext";

export default function MainLayout() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const toast = useToast();

    useEffect(() => {
        let isMounted = false;

        loadData()
        .then(() => setIsLoaded(true))
        .catch((e: Error) => {
            if (e.name === 'TypeError' && e.message === 'Network request timed out') {
                toast.show(
                    'Internet access is required.',
                    {
                        placement: 'top',
                        duration: 50000
                    }
                )
            } else {
                toast.show(
                    'Something went wrong. Please try again later.',
                    {
                        placement: 'top',
                        duration: 50000
                    }
                )
            }
        });

        async function loadData() {
            if (!isMounted) {
              // fetch user data
              const data = await fetchUserData();
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