// https://rnr-docs.vercel.app/components/table/
import { View, useWindowDimensions } from 'react-native';
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

import { useGlobalContext, type GlobalState } from '~/app/context/GlobalContext';

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

export default function AllTransactionsTable() {
    const { userData, storeData } = useGlobalContext() as GlobalState;
    const { width } = useWindowDimensions();

    return (
      <Card className='w-full py-2'>
        <CardContent>
          <Table aria-labelledby='transctions-table'>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: width / 5 }}>
                  <Text className='font-display-medium'>Date</Text>
                </TableHead>
                <TableHead style={{ width: width / 3 }}>
                  <Text className='font-display-medium'>Store</Text>
                </TableHead>
                <TableHead style={{ width: width / 4 }}>
                  <Text className='font-display-medium'>Amount</Text>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <FlashList
                data={userData.transactions.slice(0, 10)}
                estimatedItemSize={100}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: transaction, index }) => {
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell style={{ width: width / 5 }}>
                        <Text>{formatDate(transaction.date)}</Text>
                      </TableCell>
                      <TableCell style={{ width: width / 3 }}>
                        <Link href={`../../store/${transaction.store_id}`}>
                          <Text className='text-yellow-400 underline'>{storeData[transaction.store_id].name}</Text>
                        </Link>
                      </TableCell>
                      <TableCell style={{ width: width / 4 }}>
                        <View className='flex flex-col gap-2'>
                          <Text>{formatAmount(transaction.amount)}</Text>
                          <Text>+{transaction.points} points</Text>
                        </View>
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