import '~/global.css';

import { useEffect, useState } from 'react';
import { AppState } from "react-native";
import { SplashScreen, Stack, Tabs } from "expo-router";
import { useFonts } from 'expo-font';

import { ThemeProvider, type Theme } from '@react-navigation/native';

import type { Session } from '@supabase/supabase-js';

import { supabase } from "@/lib/supabase";
import { fetchUserData, type UserData } from '@/utils/crud';

import { NAV_THEME } from '~/lib/constants';

import GlobalContextProvider from './context/GlobalContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

// prevent Splash Screen from hiding before loading is complete
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // load fonts
  const [fontsLoaded, fontError] = useFonts({
    'Raleway': require("assets/fonts/Raleway/static/Raleway-Regular.ttf"),
    'Raleway-Medium': require("assets/fonts/Raleway/static/Raleway-Medium.ttf"),
    'Raleway-SemiBold': require("assets/fonts/Raleway/static/Raleway-SemiBold.ttf"),
  });

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
          const data = await fetchUserData();
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
    if (isLoaded && (fontsLoaded || fontError)) SplashScreen.hideAsync();
}, [isLoaded, fontsLoaded, fontError]);

  if (!(isLoaded && userData && (fontsLoaded || fontError))) return null;

  return (
    <ThemeProvider value={LIGHT_THEME}>
      <GlobalContextProvider session={session} initialState={userData}>
            <Stack />
      </GlobalContextProvider>
    </ThemeProvider>
  )
}