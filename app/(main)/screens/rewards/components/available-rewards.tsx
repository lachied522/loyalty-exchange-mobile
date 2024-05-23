import { useMemo } from 'react';
import { View } from 'react-native';

import { FlashList } from '@shopify/flash-list';

import { Large } from '~/components/ui/typography';
import { Text } from '~/components/ui/text';

import { useMainContext, type MainState } from '../../../context/MainContext';

import RewardCard from './reward-card';

export default function AvailableRewards() {
    const { userData, storeData } = useMainContext() as MainState;

    const rewards = useMemo(() => {
        const _rewards = [];

        for (const pointBalance of userData.points) {
            const store = storeData[pointBalance.store_id];

            if (store) {
                _rewards.push(...store.rewards);
            }
        }

        return _rewards.sort((a, b) => b.cost - a.cost);
    },  [userData.points, storeData]);

    return (
        <View className='flex flex-col bg-white gap-4 p-3 pt-6'>
            <Large>Available Rewards</Large>

            <View className='min-h-[100px] p-3'>
                <FlashList
                    horizontal={!!rewards}
                    data={rewards}
                    estimatedItemSize={240}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className='h-full mx-4'/>}
                    renderItem={({ item }) => (
                        <RewardCard key={`reward-card-${item.id}`} rewardData={item} />
                    )}
                    ListEmptyComponent={() => (
                        <View className='w-[360px] flex flex-col items-center justify-center gap-2 p-6'>
                            <Large>Nothing here yet.</Large>
                            <Text className='text-center'>
                                When you make a purchase at one of stores the available rewards will appear here.
                            </Text>
                        </View>
                    )}
                />
            </View>
        </View>

    )
}