// https://rnr-docs.vercel.app/components/table/
import { View, useWindowDimensions } from 'react-native';
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

import { formatDate } from '@/utils/formatting';

import type { MainState } from '~/app/(main)/context/MainContext';

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatAmount(amount: number) {
  return USDollar.format(Math.abs(amount));
}

interface TransactionsTableProps {
    data: MainState['userData']['transactions']
}

export default function RecentTransactions({ data }: TransactionsTableProps) {
    const { width } = useWindowDimensions();

    return (
      <View className='w-full min-h-[240px] flex flex-col bg-white gap-4 p-3 pt-6'>
        <Large>Recent Transactions</Large>

        <Table aria-labelledby='transctions-table'>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: width / 3 }}>
                <Text className='font-display-medium'>Date</Text>
              </TableHead>
              <TableHead style={{ width: width / 4 }}>
                <Text className='font-display-medium'>Amount</Text>
              </TableHead>
              <TableHead style={{ width: width / 4 }}>
                <Text className='font-display-medium'>Points</Text>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <FlashList
              data={data.slice(0, 10)}
              estimatedItemSize={100}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: transaction, index }) => {
                return (
                  <TableRow key={transaction.id}>
                    <TableCell style={{ width: width / 3 }}>
                      <Text>{formatDate(transaction.date)}</Text>
                    </TableCell>
                    <TableCell style={{ width: width / 4 }}>
                      <Text>{formatAmount(transaction.amount)}</Text>
                    </TableCell>
                    <TableCell style={{ width: width / 4 }}>
                        <Text>+{transaction.points} points</Text>
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
      </View>
    )
}