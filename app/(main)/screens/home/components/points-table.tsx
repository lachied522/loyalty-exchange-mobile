import { useMemo } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';

import { FlashList } from '@shopify/flash-list';

import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Large } from '~/components/ui/typography';

import type { UserData } from '@/utils/crud';

interface PointsTableProps {
    data: UserData['points']
}

export default function PointsTable({ data }: PointsTableProps) {
    const sortedData = useMemo(() => {
        return data.sort((a, b) => b.balance - a.balance);
    }, [data]);

    return (
        <Card>
            <CardContent className='min-h-[100px] py-2'>
                <FlashList
                    data={sortedData}
                    estimatedItemSize={45}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className='w-full border-b border-slate-300'/>}
                    renderItem={({ item, index }) => (
                        <View key={`points-table-row-${index}`} className='py-4'>
                            <Link href={`../../store/${item.store_id}`}>
                                <View className='w-full flex flex-row justify-between'>
                                    <Text className='font-display-semibold truncate'>{item.stores!.name}</Text>
                                    <Large>{item.balance.toLocaleString()}</Large>
                                </View>
                            </Link>
                        </View>
                        )
                    }
                    ListEmptyComponent={() => (
                        <View className='h-[240px] flex flex-col items-center justify-center gap-2 py-6'>
                            <Large>Nothing here yet.</Large>
                            <Text>Your points will automatically start accumulating here.</Text>
                        </View>
                    )}
                />
            </CardContent>
        </Card>
    )
}