import { useMemo } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';

import { FlashList } from '@shopify/flash-list';

import { Text } from '~/components/ui/text';
import { Large } from '~/components/ui/typography';

import { truncateText } from '@/utils/formatting';

import { useMainContext, type MainState } from '~/app/(main)/context/MainContext';
import StoreImage from '~/app/(main)/components/store-image';

export default function PointsList() {
    const { userData, storeDataMap } = useMainContext() as MainState;
    
    const sortedData = useMemo(() => {
        return userData.points.sort((a, b) => b.balance - a.balance);
    }, [userData.points]);

    return (
        <View className='flex flew-col bg-white gap-4 p-3 pt-6'>
            <Large>My Stores</Large>

            <View className='p-3'>
                <FlashList
                    horizontal={!!sortedData}
                    data={sortedData}
                    estimatedItemSize={200}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className='h-full mx-4'/>}
                    renderItem={({ item, index }) => (
                        <Link key={`store-list-item-${index}`} href={`../../store/${item.store_id}`}>
                            <View className='max-w-[180px] flex flex-col items-start gap-2'>
                                <StoreImage
                                    url={storeDataMap[item.store_id]?.store_img_url || null}
                                    width={180}
                                />

                                <View className='flex flex-col justify-start'>
                                    <Large className='font-display-semibold'>{truncateText(item.stores!.name, 18)}</Large>
                                    <Text>{Math.floor(Math.max(item.balance, 0)).toLocaleString()} points</Text>
                                </View>
                            </View>
                        </Link>
                        )
                    }
                    ListEmptyComponent={() => (
                        <View className='w-[360px] h-[240px] flex flex-col items-center justify-center gap-2 py-6'>
                            <Large>Nothing here yet.</Large>
                            <Text className='text-center'>
                                Your points will automatically appear here when you make a purchase at one of our stores.
                            </Text>
                            <Text className='text-center'>
                                Make sure your card is connected so we can track your spending.
                            </Text>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}