// https://rnr-docs.vercel.app/components/table/
import { Linking, View, useWindowDimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table';
import { Text } from '~/components/ui/text';
import { Large, Small } from '~/components/ui/typography';
import { Button } from '~/components/ui/button';

import { formatDate } from '@/utils/formatting';

import type { MainState } from '~/app/(main)/context/MainContext';

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatAmount(amount: number) {
  return USDollar.format(Math.abs(amount));
}

const ContactButton = ({ storeName } : { storeName: string }) => {
  return (
    <Button
      onPress={() => Linking.openURL(`mailto:info@loyaltyexchange.com.au?subject=Missing Purchase from ${storeName}`)}
      className='min-h-[40px]'
    >
        <Text className='font-display-medium text-xl text-black'>Contact Us</Text>
    </Button>
  )
}

interface TransactionsTableProps {
    data: MainState['userData']['transactions']
    storeName: string | null
}

export default function RecentTransactions({ data, storeName }: TransactionsTableProps) {
    const { width } = useWindowDimensions();

    return (
      <View className='w-full min-h-[240px] flex flex-col bg-white gap-4 p-3 pt-6'>
        <Large>Recent Transactions</Large>

        <Table aria-labelledby='transctions-table'>
          <TableHeader>
            <TableRow className='border-b border-neutral-200'>
              <TableHead style={{ width: width / 3 }}>
                <Text className='font-display-medium'>Date</Text>
              </TableHead>
              <TableHead style={{ width: width / 4 }}>
                <Text className='font-display-medium'>Amount</Text>
              </TableHead>
              <TableHead className='items-end' style={{ width: width / 3 }}>
                <Text className='font-display-medium'>Points</Text>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <FlashList
              data={data.slice(0, 5)}
              estimatedItemSize={100}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: transaction, index }) => {
                return (
                  <TableRow key={transaction.id} className='border-0'>
                    <TableCell style={{ width: width / 3 }}>
                      <Text>{formatDate(transaction.date)}</Text>
                    </TableCell>
                    <TableCell style={{ width: width / 4 }}>
                      <Text>{formatAmount(transaction.amount)}</Text>
                    </TableCell>
                    <TableCell className='items-end' style={{ width: width / 3 }}>
                        <Text>+{transaction.points} points</Text>
                    </TableCell>
                  </TableRow>
                );
              }}
              ListEmptyComponent={() => (
                <View className='min-h-[240px] flex flex-col items-center justify-center gap-2 p-6'>
                    <Large>Nothing here yet.</Large>
                    <Text className='text-center'>When you shop here your recent transactions will appear here.</Text>
                </View>
              )}
              ListFooterComponent={() => (
                <TableFooter>
                  <View className='min-h-[120px] flex flex-col items-center gap-1 p-12'>
                    <Text>Purchases not here?</Text>
                    <Small className='text-center'>
                      Allow up to 24 hours for purchases to appear. If more than 24 hours has passed please contact us.
                    </Small>
                    <ContactButton storeName={storeName || 'Store'} />
                  </View>
                </TableFooter>
              )}
            />
          </TableBody>
        </Table>
      </View>
    )
}