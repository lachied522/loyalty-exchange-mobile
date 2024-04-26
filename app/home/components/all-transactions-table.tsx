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

import { shadowStyles } from '~/lib/constants';

import { useGlobalContext, type GlobalState } from '~/app/context/GlobalContext';

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

function formatAmount(amount: number) {
  return USDollar.format(amount);
}

export default function AllTransactionsTable() {
    const { userData } = useGlobalContext() as GlobalState;
    const { width } = useWindowDimensions();

    return (
      <ScrollView contentContainerStyle={{ minHeight: 240 }} horizontal bounces={false} showsHorizontalScrollIndicator={true}>
        <Card className='h-[280px] py-2' style={shadowStyles.card}>
          <CardContent>
            <Table aria-labelledby='transctions-table'>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: width / 5 }}>
                    <Text className='font-display-medium'>Date</Text>
                  </TableHead>
                  <TableHead style={{ width: width / 5 }}>
                    <Text className='font-display-medium'>Store</Text>
                  </TableHead>
                  <TableHead style={{ width: width / 5 }}>
                    <Text className='font-display-medium'>Amount</Text>
                  </TableHead>
                  <TableHead style={{ width: width / 5 }}>
                    <Text className='font-display-medium'>Points</Text>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <FlashList
                  data={userData.transactions}
                  estimatedItemSize={45}
                  showsVerticalScrollIndicator={true}
                  renderItem={({ item: transaction, index }) => {
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell style={{ width: width / 5 }}>
                          <Text>{formatDate(transaction.date)}</Text>
                        </TableCell>
                        <TableCell style={{ width: width / 5 }}>
                          <Text>{transaction.store_id}</Text>
                        </TableCell>
                        <TableCell style={{ width: width / 5 }}>
                          <Text>{formatAmount(transaction.amount)}</Text>
                        </TableCell>
                        <TableCell style={{ width: width / 5 }}>
                          <Text>{transaction.points}</Text>
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
      </ScrollView>
    )
}