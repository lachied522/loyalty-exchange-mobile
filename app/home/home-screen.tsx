import { SafeAreaView, View, ScrollView } from "react-native";
import { Stack } from "expo-router";

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

import { H1, Large, Small } from "~/components/ui/typography";

import PointsTable from "./components/points-table";
import RefreshTrigger from "./components/refresh-trigger";
import RewardsList from "./components/rewards-list";

export default function Home() {
    const { userData } = useGlobalContext() as GlobalState;

    return (
        <SafeAreaView style={{ flex: 1, marginBottom: 36 }}>
            <Stack.Screen
                options={{
                    title: 'Home'
                }}
            />
            <ScrollView
                contentContainerStyle={{ height: '100%', justifyContent: 'space-between', padding: 24, gap: 24 }}
                keyboardShouldPersistTaps='handled'
            >
                <View className='flex flex-row items-center justify-between'>
                    <View className='gap-1'>
                        <H1>Username</H1>

                        <View>
                            <Large>{Math.round(userData.points_balance).toLocaleString()}</Large>
                            <Small>Exchange Points</Small>
                        </View>
                    </View>

                    <RefreshTrigger />
                </View>


                <View className='gap-2'>
                    <Large>My Rewards</Large>

                    <RewardsList />
                </View>

                <View className='gap-2'>
                    <Large>My Points</Large>

                    <PointsTable data={[]} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}