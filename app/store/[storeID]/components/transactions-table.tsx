// https://rnr-docs.vercel.app/components/table/
import { useMemo } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
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

import type { Transaction } from '@/types/basiq';

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Note: January is 0 in JavaScript
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
}

function formatAmmount(amount: string) {
  return USDollar.format(parseFloat(amount));
}


interface TransactionsTableProps {
    data: Transaction[]
}

export default function TransactionsTable({ data }: TransactionsTableProps) {
    const { width } = useWindowDimensions();

    const columnWidths = useMemo(() => {
        const MIN_COLUMN_WIDTHS = [60, 120, 100];

        return MIN_COLUMN_WIDTHS.map((minWidth) => {
          const evenWidth = width / MIN_COLUMN_WIDTHS.length;
          return evenWidth > minWidth ? evenWidth : minWidth;
        });
    }, [width]);

    return (
      <ScrollView contentContainerStyle={{ width: '100%', height: 500 }} horizontal bounces={false} showsHorizontalScrollIndicator={false}>
        <Table aria-labelledby='transctions-table'>
          <TableHeader>
            <TableRow>
              <TableHead className='px-0.5' style={{ width: columnWidths[0] }}>
               <Text>Date</Text>
              </TableHead>
              <TableHead style={{ width: columnWidths[1] }}>
                <Text>Description</Text>
              </TableHead>
              <TableHead style={{ width: columnWidths[2] }}>
                <Text>Amount</Text>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <FlashList
              data={data?.slice(0, 30) || []} // TO DO: pagination
              estimatedItemSize={45}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: transaction, index }) => {
                return (
                  <TableRow 
                    key={transaction.id}
                    className={cn('active:bg-secondary', index % 2 && 'bg-muted/40')}
                  >
                    <TableCell style={{ width: columnWidths[0] }}>
                      <Text>{formatDate(transaction.postDate)}</Text>
                    </TableCell>
                    <TableCell style={{ width: columnWidths[1] }}>
                      <Text className='max-h-[50px] truncate'>{transaction.description}</Text>
                    </TableCell>
                    <TableCell style={{ width: columnWidths[2] }}>
                      <Text>{formatAmmount(transaction.amount)}</Text>
                    </TableCell>
                  </TableRow>
                );
              }}
              ListEmptyComponent={() => (
                <View className='flex flex-col items-center justify-center gap-2 p-6'>
                    <Large>Nothing here yet.</Large>
                    <Text>When you shop here your recent transactions will appear here.</Text>
                </View>
            )}
            />
          </TableBody>
        </Table>
      </ScrollView>
    )
}