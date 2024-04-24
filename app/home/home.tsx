import { SafeAreaView, View, ScrollView } from "react-native";
import { Stack } from "expo-router";

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

import { H1, Large } from "~/components/ui/typography";

import RewardsTable from "./components/rewards-table";
import PointsTable from "./components/points-table";
import RefreshTrigger from "./components/refresh-trigger";

export default function Home() {
    const { userData } = useGlobalContext() as GlobalState;

    return (
        <SafeAreaView style={{ flex: 1, marginTop: 64, marginBottom: 36 }}>
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />
            <ScrollView
                contentContainerStyle={{ padding: 24, gap: 24 }} 
                keyboardShouldPersistTaps='handled'
            >
                <View className='flex flex-row items-center justify-between'>
                    <View className='gap-1'>
                        <H1>Username</H1>

                        <Large>Boomerang Points {userData.points_balance}</Large>
                    </View>

                    <RefreshTrigger />
                </View>


                <View className='gap-2'>
                    <Large>My Rewards</Large>

                    <RewardsTable data={[]} />
                </View>

                <View className='gap-2'>
                    <Large>My Points</Large>

                    <PointsTable data={[]} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}