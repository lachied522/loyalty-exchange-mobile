import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';

import { FlashList } from '@shopify/flash-list';

import { Large } from '~/components/ui/typography';
import { Text } from '~/components/ui/text';

import { useMainContext, type MainState } from "../../../context/MainContext";

import { formatDate } from '@/utils/formatting';

export default function RecentlyRedeemed() {
    const { userData, storeDataMap, setMyRewardsIsOpen } = useMainContext() as MainState;

    const sortedData = useMemo(() => {
        return userData.redeemed.sort((a, b) => new Date(b.redeemed_at).getTime() - new Date(a.redeemed_at).getTime());
    }, [userData.redeemed]);

    return (
        <View className='flex flex-col bg-white gap-4 p-3 pt-6 pb-12'>
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
                    renderItem={({ item, index }) => (
                            <View className='w-full py-4'>
                                <Link key={item.id} href={`../../store/${item.rewards.store_id}`} asChild>
                                    <TouchableOpacity onPress={() => setMyRewardsIsOpen(false)}>
                                        <View className='w-full flex flex-row items-center justify-between'>
                                            <View className='max-w-[75%]'>
                                                <Text>{formatDate(item.redeemed_at)}</Text>
                                                <Text className='font-display-semibold'>
                                                    {storeDataMap[item.rewards.store_id]?.name || 'Store Name'}
                                                </Text>
                                            </View>
                                            <Text>{item.rewards.title}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        )
                    }
                    ListEmptyComponent={() => (
                        <View className='flex flex-col items-center justify-center gap-2 p-6'>
                            <Large>Nothing here yet.</Large>
                            <Text className='text-center'>Your recently redeemed rewards will appear here.</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}