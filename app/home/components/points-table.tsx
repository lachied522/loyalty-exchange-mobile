import { useMemo } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';

import { FlashList } from '@shopify/flash-list';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Large } from '~/components/ui/typography';

import { shadowStyles } from '~/lib/constants';

import type { UserData } from '@/utils/crud';

interface PointsTableProps {
    data: UserData['points']
}

export default function PointsTable({ data }: PointsTableProps) {
    const { width } = useWindowDimensions();

    const sortedData = useMemo(() => {
        return data.sort((a, b) => b.balance - a.balance);
    }, [data]);

    return (
        <ScrollView contentContainerStyle={{ width: '100%', minHeight: 180 }} horizontal bounces={false} showsHorizontalScrollIndicator={false}>
            <Card className='w-full py-2' style={shadowStyles.card}>
                <CardContent className='mx-auto'>
                    <Table aria-labelledby='points-table'>
                        <TableHeader>
                            <TableRow>
                                <TableHead style={{ width: width / 2 }}>
                                    <Text className='font-display-medium'>Store</Text>
                                </TableHead>
                                <TableHead style={{ width: width / 2 }}>
                                    <Text className='font-display-medium'>Balance</Text>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <FlashList
                                data={sortedData}
                                estimatedItemSize={45}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => (
                                    <TableRow key={`points-table-row-${index}`}>
                                        <TableCell style={{ width: width / 2 }}>
                                            <Link href={`../../store/${item.store_id}`}>
                                                <Text className='max-h-[50px] text-yellow-400 underline truncate'>{item.stores!.name}</Text>
                                            </Link>
                                        </TableCell>
                                        <TableCell style={{ width: width / 2 }}>
                                            <Large>{item.balance.toLocaleString()}</Large>
                                        </TableCell>
                                    </TableRow>
                                    )
                                }
                                ListEmptyComponent={() => (
                                    <View className='h-[240px] flex flex-col items-center justify-center gap-2 py-6'>
                                        <Large>Nothing here yet.</Large>
                                        <Text>Your points will automatically start accumulating here.</Text>
                                    </View>
                                )}
                            />
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </ScrollView>
    )
}