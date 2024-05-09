import { useEffect, useState } from 'react';
import { Stack } from "expo-router";
import { useToast } from 'react-native-toast-notifications';

import type { UserData } from '@/types/helpers';
import { fetchUserData } from '@/utils/functions';

import LoadingScreen from './loading-screen';
import MainContextProvider from "./context/MainContext";

function handleError(error: Error, toast: ReturnType<typeof useToast>) {
    if (error.name === 'TypeError' && error.message === 'Network request timed out') {
      toast.show(
        'Internet access is required.',
        {
            placement: 'top',
            duration: 5000
        }
      )
    } else {
      toast.show(
        'Something went wrong. Please try again later.',
        {
            placement: 'top',
            duration: 5000
        }
      )
    }
}

export default function MainLayout() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const toast = useToast();

    useEffect(() => {
        let isMounted = false;

        loadData();

        async function loadData() {
            if (!isMounted) {
              // fetch user data
              const data = await fetchUserData()
              .catch((e) => {
                handleError(e, toast);
              });
              // update state
              if (!!data) {
                setUserData(data);
                setIsLoaded(true);
              };
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