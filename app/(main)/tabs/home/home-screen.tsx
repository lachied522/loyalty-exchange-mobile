import { useState, useCallback } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { Stack } from "expo-router";

import { type MainState, useMainContext } from "../../context/MainContext";

import RecentTransactions from "./components/recent-transactions";
import PointsList from "./components/points-list";
import HomeHeader from "./components/home-header";

export default function HomeScreen() {
    const { refreshUserDataAndUpdateState } = useMainContext() as MainState;
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const onRefresh = useCallback(
        async () => {
            setIsRefreshing(true);

            // ensure refresh is shown for at least 2 seconds
            const minWaitTime = new Promise((resolve) => setTimeout(resolve, 2000));
            await Promise.all([
                refreshUserDataAndUpdateState(),
                minWaitTime
            ])
            .then(() => setIsRefreshing(false));
        },
        [setIsRefreshing, refreshUserDataAndUpdateState]
    );

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
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                }
            >
                <PointsList />

                <RecentTransactions />
            </ScrollView>
        </>
    )
}