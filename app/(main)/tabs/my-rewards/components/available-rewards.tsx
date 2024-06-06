import { useMemo } from 'react';
import { View } from 'react-native';

import { FlashList } from '@shopify/flash-list';

import { Large } from '~/components/ui/typography';
import { Text } from '~/components/ui/text';

import { useMainContext, type MainState } from '~/app/(main)/context/MainContext';
import RewardCard from '~/app/(main)/components/reward-card';

import type { Reward } from '~/app/types/helpers';

export default function AvailableRewards() {
    const { userData, storeDataMap } = useMainContext() as MainState;

    const rewards = useMemo(() => {
        const _rewards: Reward[] = [];

        for (const pointBalance of userData.points) {
            const store = storeDataMap[pointBalance.store_id];

            if (store) {
                _rewards.push(...store.rewards);
            }
        }

        function sortRewards(a: Reward, b: Reward) {
            // sort available rewards by cost, but group limited time rewards at the start
            if (a.expires_at) {
                return -1;
            }
            return b.cost - a.cost;
        }
        return _rewards.sort(sortRewards);
    },  [userData.points, storeDataMap]);

    return (
        <View className='flex flex-col bg-white gap-4 p-3 pt-6'>
            <Large>Available Rewards</Large>

            {rewards.length > 0? (
            <View className='p-3'>
                <FlashList
                    horizontal
                    data={rewards}
                    estimatedItemSize={400}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className='h-full mx-4'/>}
                    renderItem={({ item }) => (
                        <RewardCard key={`reward-card-${item.id}`} rewardData={item} />
                    )}
                />
            </View>
            ) : (
            <View className='h-[240px] flex flex-col items-center justify-center gap-2 p-6'>
                <Large>Nothing here yet.</Large>
                <Text className='text-center'>
                    When you make a purchase at one of stores the available rewards will appear here.
                </Text>
            </View>
            )}
        </View>

    )
}