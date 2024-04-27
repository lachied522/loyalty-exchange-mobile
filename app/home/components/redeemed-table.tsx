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
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Large } from '~/components/ui/typography';

import { useGlobalContext, type GlobalState } from '@/context/GlobalContext';

function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Note: January is 0 in JavaScript
    return `${day}/${month}`;
  }

export default function RedeemedTable() {
    const { userData, storeData } = useGlobalContext() as GlobalState;
    const { width } = useWindowDimensions();

    const filteredData = useMemo(() => {
        return userData.rewards.filter((obj) => obj.redeemed).slice(0, 10);
    }, [userData]);

    return (
        <Card className='w-full py-2'>
            <CardContent>
                <Table aria-labelledby='rewards-table'>
                    <TableHeader>
                        <TableRow>
                            <TableHead style={{ width: width / 5 }}>
                                <Text className='font-display-medium'>Date</Text>
                            </TableHead>
                            <TableHead style={{ width: width / 3 }}>
                                <Text className='font-display-medium'>Store</Text>
                            </TableHead>
                            <TableHead style={{ width: width / 4 }}>
                                <Text className='font-display-medium'>Reward</Text>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <FlashList
                            data={filteredData}
                            estimatedItemSize={100}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item: reward, index }) => (
                                <TableRow key={reward.id}>
                                    <TableCell style={{ width: width / 5 }}>
                                        <Text>{formatDate(reward.redeemed_at!)}</Text>
                                    </TableCell>
                                    <TableCell style={{ width: width / 3 }}>
                                        <Link href={`./store/${reward.id}`}>
                                            <Text className='max-w-[100px] text-yellow-400 underline truncate'>{storeData[reward.reward_types!.store_id].name}</Text>
                                        </Link>
                                    </TableCell>
                                    <TableCell style={{ width: width / 4 }}>
                                        <Text>{reward.reward_types!.title}</Text>
                                    </TableCell>
                                </TableRow>
                                )
                            }
                            ListEmptyComponent={() => (
                                <View className='flex flex-col items-center justify-center gap-2 p-6'>
                                    <Large>Nothing here yet.</Large>
                                    <Text>Your recently redeemed rewards will appear here.</Text>
                                </View>
                            )}
                        />
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}