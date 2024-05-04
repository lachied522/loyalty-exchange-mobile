import { useMemo } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';

import { FlashList } from '@shopify/flash-list';

import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Large, Small } from '~/components/ui/typography';

import { useMainContext, type MainState } from '~/app/(main)/context/MainContext';
import StoreImage from '~/app/(main)/components/store-image';


function formatName(text: string) {
    // tailwind doesn't seem to truncate text, even with set width
    return text.length > 18? text.slice(0, 18) + '...': text;
}

export default function StoresList() {
    const { userData } = useMainContext() as MainState;
    const sortedData = useMemo(() => {
        return userData.points.sort((a, b) => b.balance - a.balance);
    }, []);

    return (
        <View className='flex flew-col bg-white gap-4 p-3 pt-6'>
            <Large>My Stores</Large>

            <View className='p-3'>
                <FlashList
                    horizontal
                    data={sortedData}
                    estimatedItemSize={200}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className='h-full mx-4'/>}
                    renderItem={({ item, index }) => (
                        <Link key={`points-table-row-${index}`} href={`../../store/${item.store_id}`}>
                            <View className='flex flex-col items-start gap-2'>
                                <StoreImage storeID='sample' />
                                <View className='w-[180px] flex flex-col'>
                                    <Large className='font-display-semibold truncate'>{formatName(item.stores!.name)}</Large>
                                    <Text>{item.balance.toLocaleString()} points</Text>
                                </View>
                            </View>
                        </Link>
                        )
                    }
                    ListEmptyComponent={() => (
                        <View className='h-[240px] flex flex-col items-center justify-center gap-2 py-6'>
                            <Large>Nothing here yet.</Large>
                            <Text>Your points will automatically start accumulating here.</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}