import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';

import { FlashList } from '@shopify/flash-list';

import { Large } from '~/components/ui/typography';
import { Text } from '~/components/ui/text';

import { useMainContext, type MainState } from "../../../context/MainContext";

import { formatDate } from '@/utils/formatting';

export default function RecentlyRedeemed() {
    const { userData, storeData, setMyRewardsIsOpen } = useMainContext() as MainState;

    const sortedData = useMemo(() => {
        return userData.rewards.sort((a, b) => new Date(b.redeemed_at).getTime() - new Date(a.redeemed_at).getTime());
    }, [userData.rewards]);

    return (
        <View className='flex flex-col bg-white gap-4 p-3 pt-6'>
            <Large>Recently Redeemed</Large>

            <View className='min-h-[100px] p-3'>
                <View className='w-full flex flex-row justify-between border-b border-neutral-200 pb-4'>
                    <Text className='font-display-medium'>When/Where?</Text>
                    <Text className='font-display-medium'>Reward</Text>
                </View>
                <FlashList
                    data={sortedData.slice(0, 5)}
                    estimatedItemSize={100}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className='w-full border-0'/>}
                    renderItem={({ item: reward, index }) => (
                            <View className='w-full py-4'>
                                <Link key={reward.id} href={`../../store/${reward.reward_types.store_id}`} asChild>
                                    <TouchableOpacity onPress={() => setMyRewardsIsOpen(false)}>
                                        <View className='w-full flex flex-row items-center justify-between'>
                                            <View className='max-w-[75%]'>
                                                <Text>{formatDate(reward.redeemed_at!)}</Text>
                                                <Text className='font-display-semibold truncate'>{storeData[reward.reward_types.store_id].name}</Text>
                                            </View>
                                            <Text>{reward.reward_types.title}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        )
                    }
                    ListEmptyComponent={() => (
                        <View className='flex flex-col items-center justify-center gap-2 p-6'>
                            <Large>Nothing here yet.</Large>
                            <Text>Your recently redeemed rewards will appear here.</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}