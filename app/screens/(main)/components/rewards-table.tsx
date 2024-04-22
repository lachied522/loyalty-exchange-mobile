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
import { Text } from '~/components/ui/text';
import { Large } from '~/components/ui/typography';

import { cn } from '~/lib/utils';

import Reward from './reward';

import type { Database } from '~/app/types/supabase';

interface RewardsTableProps {
    data: Database['public']['Tables']['rewards']['Row'][]
}

export default function RewardsTable({ data }: RewardsTableProps) {
    const { width } = useWindowDimensions();

    const columnWidths = useMemo(() => {
        const MIN_COLUMN_WIDTHS = [60, 120, 60];

        return MIN_COLUMN_WIDTHS.map((minWidth) => {
          const evenWidth = width / MIN_COLUMN_WIDTHS.length;
          return evenWidth > minWidth ? evenWidth : minWidth;
        });
      }, [width]);

    return (
        <ScrollView contentContainerStyle={{ width: '100%', height: 250 }} horizontal bounces={false} showsHorizontalScrollIndicator={false}>
            <Table aria-labelledby='rewards-table'>
                <TableHeader>
                    <TableRow>
                        <TableHead className='px-0.5' style={{ width: columnWidths[0] }}>
                            <Text>Reward</Text>
                        </TableHead>
                        <TableHead style={{ width: columnWidths[1] }}>
                            <Text>Store</Text>
                        </TableHead>
                        <TableHead style={{ width: columnWidths[2] }}>
                            <Text>Redeem</Text>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <FlashList
                        data={data}
                        estimatedItemSize={45}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <TableRow 
                                key={`reward-${index}`} // TODO
                                className={cn('active:bg-secondary', index % 2 && 'bg-muted/40')}
                            >
                                <TableCell style={{ width: columnWidths[0] }}>
                                    <Text>1 free coffee</Text>
                                </TableCell>
                                <TableCell style={{ width: columnWidths[1] }}>
                                    <Link href={`./store/${item.id}`}>
                                        <Text className='max-h-[50px] text-slate-700 font-medium truncate'>Test Coffee Shop</Text>
                                    </Link>
                                </TableCell>
                                <TableCell style={{ width: columnWidths[2] }}>
                                    <Reward />
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
    )
}