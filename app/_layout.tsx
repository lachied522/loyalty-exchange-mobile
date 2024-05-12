import '~/global.css';

import { useEffect, useState } from 'react';
import { AppState } from "react-native";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from 'expo-font';

import { ThemeProvider, type Theme } from '@react-navigation/native';
import { ToastProvider } from 'react-native-toast-notifications'

import type { Session } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabase";

import { PortalHost } from '~/components/primitives/portal';
import { NAV_THEME } from '~/constants/styling';

import GlobalContextProvider from './context/GlobalContext';
import CustomToast from './custom-toast';

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
  try {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  } catch (e) {
    // likely environment variables are undefined
    console.log(e);
  }
});

// prevent Splash Screen from hiding before loading is complete
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [session, setSession] = useState<Session | null>(null);

  // load fonts
  const [fontsLoaded, fontError] = useFonts({
    'Raleway': require("assets/fonts/Raleway/static/Raleway-Regular.ttf"),
    'Raleway-Medium': require("assets/fonts/Raleway/static/Raleway-Medium.ttf"),
    'Raleway-SemiBold': require("assets/fonts/Raleway/static/Raleway-SemiBold.ttf"),
  });

  // get user session
  useEffect(() => {
    supabase.auth.getSession()
    .then(({ data: { session } }) => {
        setSession(session);
    })
    .catch((e) => {
      console.log(e);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
    });
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
}, [fontsLoaded, fontError]);

  if (!(fontsLoaded || fontError)) return null;

  return (
    <>
      <ThemeProvider value={LIGHT_THEME}>
        <ToastProvider
          offsetTop={80}
          swipeEnabled={true}
          renderToast={CustomToast}
        >
          <GlobalContextProvider session={session}>
              <Stack />
          </GlobalContextProvider>
        </ToastProvider>
      </ThemeProvider>
      <PortalHost />
    </>
  )
}