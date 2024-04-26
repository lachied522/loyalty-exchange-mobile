import { SafeAreaView, View, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { H1, H2, Large, Small } from "~/components/ui/typography";
import { ArrowRightLeft } from "~/components/Icons";

import { shadowStyles } from '~/lib/constants';

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";
import { useMainContext, type MainState } from "./context/MainContext";

import PointsTable from "./components/points-table";
import RefreshTrigger from "./components/refresh-trigger";
import AllTransactionsTable from "./components/all-transactions-table";

export default function Home() {
    const { pointsExchangeIsOpen, setPointsExchangeIsOpen } = useMainContext() as MainState;
    const { userData } = useGlobalContext() as GlobalState;

    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={{ flex: 1, marginBottom: 36 }}>
            <Stack.Screen
                options={{
                    header: () => (
                        <View className='w-full flex flex-col items-stretch justify-center bg-white px-6 pb-8 gap-2' style={{ paddingTop: insets.top, ...shadowStyles.edge }}>
                            <View className='w-full items-center mt-1'>
                                <H2>Welcome {userData.first_name}</H2>
                            </View>
                            <View className='flex flex-row items-start justify-between'>
                                <View className='flex items-center justify-center rounded-xl border border-yellow-400 gap-2 p-2'>
                                    <TouchableOpacity onPress={() => setPointsExchangeIsOpen(true)}>
                                        <View className='flex flex-row items-center justify-start gap-2'>
                                            <H2>{Math.max(Math.round(userData.points_balance), 0).toLocaleString()}</H2>
                                            {/* <ArrowRightLeft color='rgb(250 204 21)' /> */}
                                        </View>
                                        
                                        <Small>LoyaltyExchange Points</Small>
                                    </TouchableOpacity>
                                </View>

                                <RefreshTrigger />
                            </View>
                        </View>
                    )
                }}
            />
            <ScrollView
                contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16, gap: 12 }}
                keyboardShouldPersistTaps='handled'
            >
                <View className='flex flex-col items-stretch gap-2'>
                    <Large>My Stores</Large>

                    <PointsTable data={userData.points} />
                </View>

                <View className='flex flex-col items-stretch gap-4'>
                    <Large>Recent Purchases</Large>

                    <AllTransactionsTable />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}