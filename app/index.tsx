import { Stack, SplashScreen } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { AppState } from "react-native";

import { supabase } from "@/lib/supabase";

import Main from './screens/main';
import Welcome from './screens/welcome';

import type { Session } from "@supabase/supabase-js";

// prevent Splash Screen from hiding before loading is complete
SplashScreen.preventAutoHideAsync();

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


export default function Index() {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [session, setSession] = useState<Session | null>(null);

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
            // TODO: fetch user data
            // 4. set isLoaded state to true
            setIsLoaded(true);
            // 5. prevent effect from running again
            isMounted = true;
        }
    }, []);

    useEffect(() => {
        if (isLoaded) SplashScreen.hideAsync();
    }, [isLoaded]);

    if (!(isLoaded)) return null;

    return (
        <>
            {session ? (
                <Main />
            ) : (
                <Welcome />
            )}
        </>
    )
}