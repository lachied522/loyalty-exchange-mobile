import '~/global.css';

import { useEffect, useState } from 'react';
import { AppState } from "react-native";
import { SplashScreen, Stack } from "expo-router";

import type { Session } from '@supabase/supabase-js';

import { supabase } from "@/lib/supabase";
import { fetchUserData, type UserData } from '@/utils/data-fetching';

import GlobalContextProvider from './context/GlobalContext';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
});

// prevent Splash Screen from hiding before loading is complete
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // get user session
  useEffect(() => {
    let isMounted = false; // prevent useEffect from triggering twice

    supabase.auth.getSession().then(({ data: { session } }) => {
        newSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
        newSession(session);
    });

    async function newSession(session: Session | null) {
        setSession(session);
        if (!isMounted) {
          // fetch user data
          const data = await fetchUserData(session);
          // update state
          setUserData(data);
        }
        // set isLoaded state to true
        setIsLoaded(true);
        // 5. prevent effect from running again
        isMounted = true;
    }
  }, []);

  useEffect(() => {
    if (isLoaded) SplashScreen.hideAsync();
}, [isLoaded]);

  return (
    <GlobalContextProvider session={session} userData={userData}>
      <Stack />
    </GlobalContextProvider>
  )
}