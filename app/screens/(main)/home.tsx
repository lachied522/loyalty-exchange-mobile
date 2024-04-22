import { SafeAreaView, View, ScrollView } from "react-native";
import { Stack } from "expo-router";

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

import { H1, Large } from "~/components/ui/typography";

import TransactionsTable from "./components/transactions-table";
import RewardsTable from "./components/rewards-table";
import PointsTable from "./components/points-table";

export default function Home() {
    const { userData } = useGlobalContext() as GlobalState;

    return (
        <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />
            <ScrollView
                contentContainerStyle={{ padding: 24 }} 
                keyboardShouldPersistTaps='handled'
            >
                <View>
                    <View className='flex flex-row gap-2'>
                        <H1>Points</H1>

                        <H1>{userData.points_balance}</H1>
                    </View>

                    <View className='gap-2'>
                        <Large>My Rewards</Large>

                        <RewardsTable data={[]} />
                    </View>

                    <View className='gap-2'>
                        <Large>My Points</Large>

                        <PointsTable data={[]} />
                    </View>

                    <View className='gap-2'>
                        <Large>My Latest Purchases</Large>

                        <TransactionsTable transactions={userData.transactions} />
                    </View>
                </View>         
            </ScrollView>
        </SafeAreaView>
    )
}