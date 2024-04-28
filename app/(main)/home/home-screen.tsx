import { SafeAreaView, View, ScrollView } from "react-native";
import { Stack } from "expo-router";

import { Large } from "~/components/ui/typography";

import { useMainContext, type MainState } from "../context/MainContext";

import PointsTable from "./components/points-table";
import RefreshTrigger from "./components/refresh-trigger";
import AllTransactionsTable from "./components/all-transactions-table";

export default function Home() {
    const { userData } = useMainContext() as MainState;

    return (
        <SafeAreaView style={{ flex: 1, marginBottom: 36 }}>
            <Stack.Screen
                options={{
                    title: 'Home',
                }}
            />
            <ScrollView
                contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16, gap: 12 }}
                keyboardShouldPersistTaps='handled'
            >
                <View className='flex flew-col gap-4'>
                    <View className='w-full flex flex-row items-end justify-between'>
                        <Large>My Stores</Large>

                        <RefreshTrigger />
                    </View>

                    <PointsTable data={userData.points} />
                </View>

                <View className='flex flex-col gap-4'>
                    <Large>Recent Purchases</Large>

                    <AllTransactionsTable />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}