import { ScrollView } from "react-native";
import { Stack } from "expo-router";

import RecentTransactions from "./components/recent-transactions";
import StoresList from "./components/stores-list";
import HomeHeader from "./components/home-header";

export default function HomeScreen() {
    return (
        <>
            <Stack.Screen
                options={{
                    header: HomeHeader
                }}
            />
            <ScrollView
                contentContainerStyle={{ gap: 12 }}
                keyboardShouldPersistTaps='handled'
            >
                <StoresList />

                <RecentTransactions />
            </ScrollView>
        </>
    )
}