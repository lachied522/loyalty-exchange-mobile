import { useMemo } from 'react';
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
import { Text } from '~/components/ui/text';
import { Large } from '~/components/ui/typography';

import { useMainContext, type MainState } from '../../../context/MainContext';

import { formatDate } from '@/utils/formatting';

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatAmount(amount: number) {
  return USDollar.format(Math.abs(amount));
}

export default function RecentTransactions() {
    const { userData, storeData } = useMainContext() as MainState;
    const { width } = useWindowDimensions();

    const sortedData = useMemo(() => {
      return userData.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [userData.transactions]);

    return (
      <View className='min-h-[50vh] flex flex-col bg-white gap-4 p-3 pt-6'>
        <Large>Recent Purchases</Large>

        <Table aria-labelledby='transctions-table'>
          <TableBody>
              <FlashList
                data={sortedData.slice(0, 10)}
                estimatedItemSize={100}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: transaction, index }) => {
                  return (
                    <TableRow key={transaction.id} className='border-0'>
                        <TableCell style={{ width: 2.75 * width / 4 }}>
                          <Link href={`../../store/${transaction.store_id}`}>
                            <View  className='flex flex-col gap-1'>
                              <Text>{formatDate(transaction.date)}</Text>
                              <Text className='font-display-semibold'>{storeData[transaction.store_id].name}</Text>
                            </View>
                          </Link>
                        
                        </TableCell>
                        <TableCell style={{ width: 1.25 * width / 4 }}>
                          <View className='flex flex-col gap-1'>
                            <Text>{formatAmount(transaction.amount)}</Text>
                            <Text className='font-display-semibold'>+{Math.round(transaction.points).toLocaleString()} points</Text>
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
      </View>
    )
}