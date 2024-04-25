import { SafeAreaView, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

import { H1, H2, Large, Small } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";

import PointsTable from "./components/points-table";
import RefreshTrigger from "./components/refresh-trigger";
import RewardsList from "./components/rewards-list";

export default function Home() {
    const { userData } = useGlobalContext() as GlobalState;

    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={{ flex: 1, marginBottom: 36 }}>
            <Stack.Screen
                options={{
                    header: () => (
                        <View className='w-full flex flex-col items-stretch justify-center bg-white px-6 pb-10' style={{ paddingTop: insets.top }}>
                            <View className='w-full items-center my-6'>
                                <Large>Home</Large>
                            </View>
                            <View className='flex flex-row items-start justify-between'>
                                <View className='gap-1'>
                                    <H2>{userData.first_name} {userData.last_name}</H2>

                                    <View>
                                        <H2>{Math.round(userData.points_balance).toLocaleString()}</H2>
                                        <Small>LoyaltyExchange Points</Small>
                                    </View>
                                </View>

                                <RefreshTrigger />
                            </View>
                        </View>
                    )
                }}
            />
            <ScrollView
                contentContainerStyle={{ height: '100%', justifyContent: 'space-between', padding: 24, gap: 24 }}
                keyboardShouldPersistTaps='handled'
            >
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