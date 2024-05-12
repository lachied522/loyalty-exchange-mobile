import { Stack, router, useFocusEffect } from 'expo-router';

import { useGlobalContext, type GlobalState } from "./context/GlobalContext";

export default function Index() {
    const { session } = useGlobalContext() as GlobalState;

    useFocusEffect(() => {
        // runs when route is in focus
        if (!session) router.replace('/login/');

        router.replace('/(main)/');
    });

    return (
        <Stack.Screen
            options={{
                headerShown: false
            }}
        />
    )
}