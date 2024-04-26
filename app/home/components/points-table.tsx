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
import { Button } from '~/components/ui/button';
import { Large } from '~/components/ui/typography';
import { ArrowRightLeft } from '~/components/Icons';

import { shadowStyles } from '~/lib/constants';

import ExchangeDialog from './exchange-dialog';

import type { UserData } from '@/utils/crud';

interface RewardsTableProps {
    data: UserData['points']
}

export default function PointsTable({ data }: RewardsTableProps) {
    const { width } = useWindowDimensions();

    return (
        <ScrollView contentContainerStyle={{ width: '100%', minHeight: 220 }} horizontal bounces={false} showsHorizontalScrollIndicator={true}>
            <Card className='w-full py-2' style={shadowStyles.card}>
                <CardContent className='mx-auto'>
                    <Table aria-labelledby='points-table'>
                        <TableHeader>
                            <TableRow>
                                <TableHead style={{ width: width / 3 }}>
                                    <Text className='font-display-medium'>Store</Text>
                                </TableHead>
                                <TableHead style={{ width: width / 4 }}>
                                    <Text className='font-display-medium'>Balance</Text>
                                </TableHead>
                                <TableHead style={{ width: width / 4 }}>
                                    <Text className='font-display-medium'>Exchange</Text>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <FlashList
                                data={data}
                                estimatedItemSize={45}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => (
                                    <TableRow key={`points-table-row-${index}`}>
                                        <TableCell style={{ width: width / 3 }}>
                                            <Link href={`../../store/${item.store_id}`}>
                                                <Text className='max-h-[50px] text-yellow-400 font-display-semibold underline truncate'>{item.stores!.name}</Text>
                                            </Link>
                                        </TableCell>
                                        <TableCell className='flex items-center justify-center' style={{ width: width / 4 }}>
                                            <Text>{item.balance.toLocaleString()}</Text>
                                        </TableCell>
                                        <TableCell className='flex items-center justify-center' style={{ width: width / 4 }}>
                                            <ExchangeDialog pointsData={item} />
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