import { SafeAreaView, View, Text } from "react-native";
import { Stack } from "expo-router";

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

import { H1, Large } from "~/components/ui/typography";

import TransactionsTable from "./components/transactions-table";
import MyRewards from "./components/my-rewards";

export default function Home() {
    const { userData } = useGlobalContext() as GlobalState;

    return (
        <SafeAreaView>
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />
            <View className='h-full flex flex-col justify-between p-6'>
                <View className='flex flex-row gap-2'>
                    <H1>Points</H1>

                    <H1>{userData.points_balance}</H1>
                </View>

                <View className='gap-2'>
                    <Large>My Rewards</Large>

                    <MyRewards />
                </View>

                <View className='gap-2'>
                    <Large>My Latest Purchases</Large>

                    <TransactionsTable transactions={userData.transactions} />
                </View>            
            </View>
        </SafeAreaView>
    )
}