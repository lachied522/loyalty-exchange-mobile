import { Stack } from "expo-router";

import MainContextProvider from "./context/MainContext";
import { useGlobalContext, type GlobalState } from "~/app/context/GlobalContext";

export default function MainLayout() {
    const { session } = useGlobalContext() as GlobalState;

    return (
        <MainContextProvider>
            <Stack />
        </MainContextProvider>
    )
}