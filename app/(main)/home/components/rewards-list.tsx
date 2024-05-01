import { useMemo } from 'react';
import { View } from 'react-native';

import { FlashList } from '@shopify/flash-list';

import { Large } from '~/components/ui/typography';
import { Text } from '~/components/ui/text';

import { useMainContext, type MainState } from '../../context/MainContext';

import RewardCard from './reward-card';

export default function RewardsList() {
    const { userData, storeData } = useMainContext() as MainState;

    const rewards = useMemo(() => {
        const hasEnoughPoints = [];

        for (const pointBalance of userData.points) {
            const store = storeData[pointBalance.store_id];

            if (store) {
                hasEnoughPoints.push(...store.reward_types.filter((obj) => obj.cost < pointBalance.balance));
            }
        }

        return hasEnoughPoints;
    },  [userData.points]);

    return (
        <View className='h-[240px] w-full'>
            <FlashList
                horizontal
                data={rewards}
                estimatedItemSize={160}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <RewardCard key={`reward-card-${item.id}`} data={item} />
                )}
                ListEmptyComponent={() => (
                    <View className='w-[360px] flex flex-col items-center justify-center gap-2 p-6'>
                        <Large>Nothing here yet.</Large>
                        <Text>When you earn enough points your rewards will appear here.</Text>
                    </View>
                )}
            />
        </View>
    )
}