import { ScrollView } from "react-native";
import { Stack } from "expo-router";

import RecentTransactions from "./components/recent-transactions";
import PointsList from "./components/points-list";
import HomeHeader from "./components/home-header";

export default function HomeScreen() {
    return (
        <>
            <Stack.Screen
                options={{
                    header: HomeHeader,
                }}
            />
            <ScrollView
                contentContainerStyle={{ gap: 12, backgroundColor: 'rgb(245 245 245)' }}
                keyboardShouldPersistTaps='handled'
            >
                <PointsList />

                <RecentTransactions />
            </ScrollView>
        </>
    )
}