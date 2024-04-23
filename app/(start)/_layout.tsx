import { Stack } from "expo-router";

import StartContextProvider from "./context/StartContext";

export default function StartLayout({ children }: { children: React.ReactNode }) {
    return (
        <StartContextProvider>
            <Stack.Screen 
                options={{
                    headerShown: false
                }}
            />
            <Stack />
        </StartContextProvider>
    )
}