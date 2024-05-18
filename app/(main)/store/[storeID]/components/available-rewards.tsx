import { useMemo } from "react";
import { View } from "react-native";

import { FlashList } from "@shopify/flash-list";

import { Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";

import { useMainContext, type MainState } from "~/app/(main)/context/MainContext";

import RewardCard from "./reward-card";

import type { StoreData } from "@/types/helpers";

interface RewardProgressProps {
    storeData: StoreData
}

export default function AvailableRewards({ storeData }: RewardProgressProps) {
    const { userData } = useMainContext() as MainState;

    const userPoints = useMemo(() => {
        return userData.points.find((obj) => obj.store_id===storeData.id)?.balance || 0;
    }, [userData, storeData]);

    return (
        <View className='w-full flex flex-col bg-white gap-4 p-3 pt-6'>
            <Large>Available Rewards</Large>
            
            <View className='p-3'>
                <FlashList
                    horizontal
                    data={storeData.rewards}
                    estimatedItemSize={240}
                    showsVerticalScrollIndicator={true}
                    ItemSeparatorComponent={() => <View className='h-full mx-4'/>}
                    renderItem={({ item }) => (
                        <RewardCard key={`reward-card-${item.id}`} data={item} userPoints={userPoints} />
                    )}
                    ListEmptyComponent={() => (
                        <View className='w-[360px] flex items-center p-12'>
                            <Text className='text-center'>This store doesn't have any rewards available yet.</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}