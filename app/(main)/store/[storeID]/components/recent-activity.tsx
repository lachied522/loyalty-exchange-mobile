import { useMemo } from 'react';
import { Linking, View, useWindowDimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { Text } from '~/components/ui/text';
import { Large, Small } from '~/components/ui/typography';
import { Button } from '~/components/ui/button';

import { formatDate, formatDollar, truncateText } from '~/app/utils/formatting';

import { useMainContext, type MainState } from "~/app/(main)/context/MainContext";

import type { StoreData } from '~/app/types/helpers';

function formatPoints(value: number) {
  const valueString = Math.round(value).toLocaleString();
  return value > 0? `+${valueString}`: valueString;
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

type Row = {
  type: 'Transaction'|'Redemption'
  id: string
  date: string,
  amount: number,
  points: number,
  reward_title?: string
}

interface TransactionsTableProps {
    storeData: StoreData
}

export default function RecentActivity({ storeData }: TransactionsTableProps) {
  // see https://rnr-docs.vercel.app/components/table/
    const { userData } = useMainContext() as MainState;

    const rows = useMemo(() => {
      return [
        ...userData.transactions.reduce(
        (acc: Row[], obj) => {
          if (obj.store_id === storeData.id) {
            return [
              ...acc,
              {
                id: obj.id,
                type: 'Transaction' as const,
                date: obj.date,
                amount: obj.amount,
                points: obj.points,
              }
            ]
          }
          return acc;
        },
        []
      ),
      ...userData.redeemed.reduce(
        (acc: Row[], obj) => {
          if (obj.rewards.store_id === storeData.id) {
            return [
              ...acc,
              {
                id: obj.id,
                type: 'Redemption' as const,
                date: obj.redeemed_at,
                amount: 0,
                points: -obj.rewards.cost,
                reward_title: obj.rewards.title,
              }
            ]
          }
          return acc;
        },
        []
      )].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [storeData.id, userData]);

    return (
      <View className='w-full min-h-[240px] flex flex-col bg-white gap-4 p-3 pt-6'>
        <Large>Recent Acitivity</Large>

        <View className='p-3'>
          <FlashList
            data={rows.slice(0, 5)}
            estimatedItemSize={100}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <View key={item.id} className='w-full flex flex-row items-center justify-between py-4'>
                    <View className='flex-[0.75]'>
                      <Text className='text-lg font-display-semibold'>
                        {item.type}
                      </Text>

                      <Text className='text-lg'>
                        {formatDate(item.date)}
                      </Text>
                    </View>

                    <View className='flex-[1.25]'>
                        <Text className='text-lg text-right font-display-medium'>
                          {item.type === 'Redemption'? 
                          truncateText(item.reward_title || 'Reward', 27): 
                          formatDollar(item.amount)}
                        </Text>

                        <Text className='text-lg text-right'>
                          {formatPoints(item.points)} points
                        </Text>
                    </View>
                </View>
              );
            }}
            ListEmptyComponent={() => (
              <View className='min-h-[240px] flex flex-col items-center justify-center gap-2 p-6'>
                  <Large>Nothing here yet.</Large>
                  <Text className='text-center'>When you shop here your recent transactions will appear here.</Text>
              </View>
            )}
            ListFooterComponent={() => (
                <View className='min-h-[120px] flex flex-col items-center gap-1 p-12'>
                  <Text>Purchases not here?</Text>
                  <Small className='text-center'>
                    Allow up to 24 hours for purchases to appear. If more than 24 hours has passed please contact us.
                  </Small>

                  <ContactButton storeName={storeData.name} />
                </View>
            )}
          />
        </View>
      </View>
    )
}