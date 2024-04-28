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
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Large } from '~/components/ui/typography';

import type { MainState } from '~/app/(main)/context/MainContext';

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Note: January is 0 in JavaScript
  return `${day}/${month}`;
}

function formatAmount(amount: number) {
  return USDollar.format(Math.abs(amount));
}

interface TransactionsTableProps {
    data: MainState['userData']['transactions']
}

export default function TransactionsTable({ data }: TransactionsTableProps) {
    const { width } = useWindowDimensions();

    return (
      <Card className='w-full py-2'>
        <CardContent>
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
        </CardContent>
      </Card>
    )
}