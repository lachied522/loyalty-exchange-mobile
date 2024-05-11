import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";

import { H1, Large } from "~/components/ui/typography";
import { colors } from "~/constants/constants";

import { useMainContext, type MainState } from "~/app/(main)/context/MainContext";
import StoreImage from "~/app/(main)/components/store-image";

import AvailableRewards from "./available-rewards";
import RecentTransactions from "./recent-transactions";

import type { StoreData } from "@/types/helpers";
import StoreHeader from "./store-header";

interface StoreProps {
    storeData: StoreData
}

function formatAddress(storeData: StoreData) {
    if (!storeData.address_line_1) return 'Address not available';

    return `${storeData.address_line_1}, ${storeData.city} ${storeData.state} ${storeData.postcode}`;
}

export default function Store({ storeData }: StoreProps) {
    const { userData } = useMainContext() as MainState;

    const userPoints = useMemo(() => {
        // get user points for this store
        return userData.points.find((obj) => obj.store_id === storeData.id)?.balance || 0;
    }, [userData, storeData]);

    const storeTransactions = useMemo(() => {
        return userData.transactions.filter((obj) => obj.store_id === storeData.id) || [];
    }, [userData, storeData]);

    return (
        <>
            <Stack.Screen
                options={{
                    header: () => <StoreHeader points={userPoints} />
                }}
            />
            <ScrollView
                contentContainerStyle={{ ...colors.background }}
                keyboardShouldPersistTaps='handled'
            >
                <View className='relative'>
                    <View className='z-[10] w-full h-full flex items-center justify-center bg-gray-800/20 p-12 absolute'>
                        <H1 className='text-center text-white'>{storeData.name}</H1>
                    </View>
                    <StoreImage storeID='' width='100%' height={240} rounded={false} />
                </View>
                <View className='flex items-center p-6 bg-white mb-3'>
                    <View className='w-full flex flex-col items-center justify-center p-3 gap-2'>
                        <Large>{'Location(s)'}</Large>

                        <Large className='font-display'>{formatAddress(storeData)}</Large>
                    </View>
                </View>

                <View className='flex flex-col gap-3'>
                    <AvailableRewards storeData={storeData} />
                            
                    <RecentTransactions data={storeTransactions} />
                </View>
            </ScrollView>
        </>
    )
}