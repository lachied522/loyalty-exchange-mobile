import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { FlashList } from '@shopify/flash-list';

import { useGlobalContext, type GlobalState } from '@/context/GlobalContext';

import RewardCard from './reward-card';
import { Large } from '~/components/ui/typography';

export default function RewardsList() {
    const { userData } = useGlobalContext() as GlobalState;

    const rewards = useMemo(() => {
        return userData.rewards.filter((reward) => !reward.redeemed);
    }, [userData.rewards]);

    return (
        <View className='h-[240] w-full p-6'>
            <FlashList
                horizontal
                data={rewards}
                estimatedItemSize={45}
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