import { useEffect, useState } from 'react';
import { Stack, router } from "expo-router";

import type { UserData } from '@/types/helpers';
import { fetchUserData } from '@/utils/functions';

import { NotLoggedInError } from '@/utils/errors';

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";
import { useCustomToast } from '../hooks/useCustomToast';

import LoadingScreen from './loading-screen';
import MainContextProvider from "./context/MainContext";

const skeletonData = {
  id: '',
  name: 'Guest',
  basiq_user_id: null,
  points_balance: 0,
  last_updated: '',
  points: [],
  redeemed: [],
  transactions: [],
} satisfies UserData;

function handleLoadingError(error: Error, toast: ReturnType<typeof useCustomToast>) {
  if (error.message === 'Network request failed') {
      toast.show('Internet access is required.');
  } else if (error.message === 'Network request timed out') {
      toast.show('Could not connect to server. Please ensure you are connected to the internet and try again.');
  } else {
      toast.show('Something went wrong. Please try again later.');
  }
}

export default function MainLayout() {
    const { session } = useGlobalContext() as GlobalState;
    const [userData, setUserData] = useState<UserData>(skeletonData);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const toast = useCustomToast();

    useEffect(() => {
        if (!session) router.replace('/login/');

        fetchUserData()
        .catch((e) => {
          if (e instanceof NotLoggedInError) {
            router.replace('/login/');
          } else {
            handleLoadingError(e, toast);
          }
        })
        .then((data) => {
          if (data) {
            setUserData(data);
            setIsLoaded(true);
          }
        });

    }, [session, setUserData, setIsLoaded]);

    if (!(isLoaded)) return <LoadingScreen />;
    
    return (
        <MainContextProvider initialState={userData}>
            <Stack />
        </MainContextProvider>
    )
}