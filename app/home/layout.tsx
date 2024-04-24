import { Stack, Tabs } from "expo-router";

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

export default function MainLayout() {
    const { session } = useGlobalContext() as GlobalState;

    return (
        <Stack />
    )
}