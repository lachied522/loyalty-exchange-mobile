import { useMemo } from 'react';
import { TouchableOpacity, View, useWindowDimensions } from 'react-native';
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
import { Button } from '~/components/ui/button';
import { Large } from '~/components/ui/typography';
import { Text } from '~/components/ui/text';

import { useMainContext, type MainState } from "../../context/MainContext";

import { formatDate } from '@/utils/formatting';

export default function RedeemedTable() {
    const { userData, storeData, setMyRewardsIsOpen } = useMainContext() as MainState;

    const filteredData = useMemo(() => {
        return userData.rewards.filter((obj) => obj.redeemed).slice(0, 10);
    }, [userData]);

    return (
        <Card>
            <CardContent>
                <View className='w-full flex flex-row justify-between border-b border-slate-400 pb-4'>
                    <Text className='font-display-medium'>When/Where?</Text>
                    <Text className='font-display-medium'>Reward</Text>
                </View>
                <FlashList
                    data={filteredData}
                    estimatedItemSize={100}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className='w-full border-b border-slate-300'/>}
                    renderItem={({ item: reward, index }) => (
                            <View className='w-full py-4'>
                                <Link key={reward.id} href={`../../store/${reward.reward_types!.store_id}`} asChild>
                                    <TouchableOpacity onPress={() => setMyRewardsIsOpen(false)}>
                                        <View className='w-full flex flex-row items-center justify-between'>
                                            <View className='max-w-[75%]'>
                                                <Text>{formatDate(reward.redeemed_at!)}</Text>
                                                <Text className='font-display-semibold truncate'>{storeData[reward.reward_types!.store_id].name}</Text>
                                            </View>
                                            <Large>{reward.reward_types!.title}</Large>
                                        </View>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        )
                    }
                    ListEmptyComponent={() => (
                        <View className='flex flex-col items-center justify-center gap-2 p-6'>
                            <Large>Nothing here yet.</Large>
                            <Text>Your recently redeemed rewards will appear here.</Text>
                        </View>
                    )}
                />
            </CardContent>
        </Card>
    )
}