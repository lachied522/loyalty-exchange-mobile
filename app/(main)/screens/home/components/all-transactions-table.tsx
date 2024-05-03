import { View } from 'react-native';
import { Link } from 'expo-router';

import { FlashList } from '@shopify/flash-list';

import { Card, CardContent } from '~/components/ui/card';
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

export default function AllTransactionsTable() {
    const { userData, storeData } = useMainContext() as MainState;

    return (
      <Card>
        <CardContent className='min-h-[100px] py-2'>
            <FlashList
              data={userData.transactions.slice(0, 10)}
              estimatedItemSize={100}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View className='w-full border-b border-slate-300'/>}
              renderItem={({ item: transaction, index }) => {
                return (
                  <View key={transaction.id} className='w-full py-4'>
                    <Link href={`../../store/${transaction.store_id}`}>
                      <View className='w-full flex flex-row justify-between'>
                        <View className='max-w-[75%] flex flex-col gap-1'>
                          <Text>{formatDate(transaction.date)}</Text>
                          <Text className='font-display-semibold'>{storeData[transaction.store_id].name}</Text>
                        </View>
                        <View className='flex flex-col gap-1'>
                          <Text>{formatAmount(transaction.amount)}</Text>
                          <Text className='font-display-semibold'>+{Math.round(transaction.points).toLocaleString()} points</Text>
                        </View>
                      </View>
                    </Link>
                  </View>
                );
              }}
              ListEmptyComponent={() => (
                <View className='flex flex-col items-center justify-center gap-2 p-6'>
                    <Large>Nothing here yet.</Large>
                    <Text>When you shop here your recent transactions will appear here.</Text>
                </View>
            )}
            />
        </CardContent>
      </Card>
    )
}