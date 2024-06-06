import { useMemo } from "react";
import { View } from "react-native";

import { FlashList } from "@shopify/flash-list";

import { Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";

import RewardCard from "../../../components/reward-card";

import type { StoreData, Reward } from "~/app/types/helpers";

interface RewardProgressProps {
    storeData: StoreData
}

export default function AvailableRewards({ storeData }: RewardProgressProps) {

    const rewards = useMemo(() => {
        function sortRewards(a: Reward, b: Reward) {
            // sort available rewards by cost, but group limited time rewards at the start
            if (a.expires_at) {
                return -1;
            }
            return b.cost - a.cost;
        }
        return storeData.rewards.sort(sortRewards);
    }, [storeData.rewards]);

    return (
        <View className='w-full flex flex-col bg-white gap-4 p-3 pt-6'>
            <Large>Available Rewards</Large>
            
            <View className='p-3'>
                <FlashList
                    horizontal
                    data={rewards}
                    estimatedItemSize={400}
                    showsVerticalScrollIndicator={true}
                    ItemSeparatorComponent={() => <View className='h-full mx-4'/>}
                    renderItem={({ item }) => (
                        <RewardCard key={`reward-card-${item.id}`} rewardData={item} />
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