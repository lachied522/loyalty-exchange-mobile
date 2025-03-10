import { useMemo } from 'react';
import { Linking, View, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';

import { FlashList } from '@shopify/flash-list';

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableFooter,
} from '~/components/ui/table';
import { Text } from '~/components/ui/text';
import { Large, Small } from '~/components/ui/typography';
import { Button } from '~/components/ui/button';

import { useMainContext, type MainState } from '../../../context/MainContext';

import { formatDate } from '@/utils/formatting';

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatAmount(amount: number) {
  return USDollar.format(Math.abs(amount));
}

const ContactButton = () => {
  return (
    <Button
      onPress={() => Linking.openURL('mailto:info@loyaltyexchange.com.au?subject=Missing Purchase')}
      className='min-h-[40px]'
    >
      <Text className=' font-display-medium text-xl text-black'>Contact Us</Text>
    </Button>
  )
}

export default function RecentTransactions() {
    const { userData, storeDataMap } = useMainContext() as MainState;
    const { width } = useWindowDimensions();

    const sortedData = useMemo(() => {
      return userData.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [userData.transactions]);

    return (
      <View className='min-h-[360px] flex flex-col bg-white gap-4 p-3 pt-6'>
        <Large>Recent Purchases</Large>

        <Table aria-labelledby='transctions-table'>
          <TableBody>
              <FlashList
                data={sortedData.slice(0, 5)}
                estimatedItemSize={100}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: transaction, index }) => {
                  return (
                    <TableRow key={transaction.id} className='border-0'>
                        <TableCell style={{ width: 2.75 * width / 4 }}>
                          <Link href={`../../store/${transaction.store_id}`}>
                            <View  className='flex flex-col gap-1'>
                              <Text>{formatDate(transaction.date)}</Text>
                              <Text className='font-display-semibold'>{storeDataMap[transaction.store_id].name}</Text>
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
                  <View className='min-h-[240px] flex flex-col items-center justify-center gap-2 p-6'>
                      <Large>Nothing here yet.</Large>
                      <Text className='text-center'>
                        When you make a purchase at one of our stores the transaction will appear here.
                      </Text>
                  </View>
                )}
                ListFooterComponent={() => (
                  <TableFooter>
                    <View className='min-h-[120px] flex flex-col items-center gap-1 p-12'>
                      <Text className='text-center'>Purchases not here?</Text>
                      <Small className='text-center'>
                        Allow up to 24 hours for purchases to appear. If more than 24 hours has passed please contact us.
                      </Small>
                      <ContactButton />
                    </View>
                  </TableFooter>
                )}
              />
            </TableBody>
        </Table>
      </View>
    )
}