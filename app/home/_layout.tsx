import { Stack } from "expo-router";

import MainContextProvider from "./context/MainContext";

export default function MainLayout() {
    return (
        <MainContextProvider>
            <Stack.Screen 
                options={{
                    headerShown: false
                }}
            />
            <Stack />
        </MainContextProvider>
    )
}