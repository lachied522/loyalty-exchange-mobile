import { Stack } from "expo-router";

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

import MainContextProvider from "./context/MainContext";

export default function MainLayout() {
    const { session } = useGlobalContext() as GlobalState;

    return (
        <MainContextProvider>
            <Stack />
        </MainContextProvider>
    )
}