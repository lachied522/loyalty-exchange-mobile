import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";

import { H1, H3, Large } from "~/components/ui/typography";
import { MapPin } from "~/components/Icons";
import { colors } from "~/constants/styling";

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

export default function StoreScreen({ storeData }: StoreProps) {
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
                    <View className='z-[10] w-full h-full flex items-center justify-center bg-neutral-800/30 p-12 absolute'>
                        <H1 className='text-center text-white'>{storeData.name}</H1>
                    </View>

                    <StoreImage
                        url={storeData.store_img_url}
                        height={240}
                        width='100%'
                        rounded={false}
                    />
                </View>
                
                <View className='flex items-center p-6 bg-white mb-3'>
                    <View className='w-full flex flex-col items-center justify-center p-3 gap-2'>
                        <H3 className='text-center'>
                            Earn 10 points for every $1 spent
                        </H3>

                        <View className='h-[1px] w-full my-3 bg-neutral-200' />
                        
                        <View className='flex flex-row items-center gap-5'>
                            <MapPin size={30} color='black' />

                            <Large className='max-w-[300px] text-right font-display'>
                                {formatAddress(storeData)}
                            </Large>
                        </View>
                    </View>
                </View>

                <View className='flex flex-col gap-3'>
                    <AvailableRewards storeData={storeData} />

                    <RecentTransactions data={storeTransactions} storeName={storeData.name} />
                </View>
            </ScrollView>
        </>
    )
}