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

import { cn } from '~/lib/utils';

import { shadowStyles } from '~/lib/constants';

import { useGlobalContext, type GlobalState } from '@/context/GlobalContext';

import Reward from './reward-trigger';

export default function RewardsTable() {
    const { userData } = useGlobalContext() as GlobalState;
    const { width } = useWindowDimensions();

    const columnWidths = useMemo(() => {
        const MIN_COLUMN_WIDTHS = [60, 60, 120];

        return MIN_COLUMN_WIDTHS.map((minWidth) => {
          const evenWidth = width / MIN_COLUMN_WIDTHS.length;
          return evenWidth > minWidth ? evenWidth : minWidth;
        });
      }, [width]);

    return (
        <Card className='h-[540px] py-2' style={shadowStyles.card}>
            <CardContent>
                <ScrollView contentContainerStyle={{ width: '100%', height: 250 }} horizontal bounces={false} showsHorizontalScrollIndicator={false}>
                    <Table aria-labelledby='rewards-table'>
                        <TableHeader>
                            <TableRow>
                                <TableHead style={{ width: columnWidths[0] }} className='p-0'>
                                    <Text>Reward</Text>
                                </TableHead>
                                <TableHead style={{ width: columnWidths[1] }} className='p-0'>
                                    <Text>Store</Text>
                                </TableHead>
                                <TableHead style={{ width: columnWidths[2] }} className='p-0'>
                                    <Text>Redeem</Text>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <FlashList
                                data={userData.rewards}
                                estimatedItemSize={45}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => (
                                    <TableRow
                                        key={item.id}
                                        className={cn('min-h-[100] active:bg-secondary', index % 2 && 'bg-muted/40')}
                                    >
                                        <TableCell style={{ width: columnWidths[0], display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                                            <Large>{item.reward_types?.title}</Large>
                                        </TableCell>
                                        <TableCell style={{ width: columnWidths[1], display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                                            <Link href={`./store/${item.id}`}>
                                                <Text className='max-w-[100px] text-slate-700 font-medium truncate'>Test Coffee Shop</Text>
                                            </Link>
                                        </TableCell>
                                        <TableCell style={{ width: columnWidths[2], display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                                        </TableCell>
                                    </TableRow>
                                    )
                                }
                                ListEmptyComponent={() => (
                                    <View className='flex flex-col items-center justify-center gap-2 p-6'>
                                        <Large>Nothing here yet.</Large>
                                        <Text>When you earn enough points your rewards will appear here.</Text>
                                    </View>
                                )}
                            />
                        </TableBody>
                    </Table>
                </ScrollView>
            </CardContent>
        </Card>
    )
}