import { useEffect, useState } from 'react';
import { Stack, router } from "expo-router";
import { useToast } from 'react-native-toast-notifications';

import type { UserData } from '@/types/helpers';
import { fetchUserData } from '@/utils/functions';

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

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
    const { session } = useGlobalContext() as GlobalState;
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const toast = useToast();

    useEffect(() => {        
        if (!session) router.replace('/login/');

        let isMounted = true;

        fetchUserData()
        .catch((e) => {
          handleError(e, toast);
        })
        .then((data) => {
          if (data && isMounted) {
            setUserData(data);
            setIsLoaded(true);
          }
        });

        return () => {
          isMounted = false;
        };
    }, [session, setUserData, setIsLoaded]);

    if (!(isLoaded && userData)) return <LoadingScreen />;

    return (
        <MainContextProvider initialState={userData}>
            <Stack />
        </MainContextProvider>
    )
}