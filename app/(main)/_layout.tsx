import { useEffect, useState } from 'react';
import { Stack, router } from "expo-router";

import type { UserData } from '~/app/types/helpers';
import { fetchUserData } from '~/app/utils/functions';

import { NotLoggedInError } from '~/app/utils/errors';

import { useGlobalContext, type GlobalState } from "~/app/context/GlobalContext";
import { useCustomToast } from '../hooks/useCustomToast';

import MainContextProvider from "./context/MainContext";
import RewardModalProvider from './context/RewardModalContext';
import LoadingScreen from './loading-screen';
import RewardModal from './components/reward-modal';

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
          <RewardModalProvider>
            <Stack />
            <RewardModal />
          </RewardModalProvider>
        </MainContextProvider>
    )
}