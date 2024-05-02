import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import { Card, CardContent } from "~/components/ui/card";
import { H1, Large, Small } from "~/components/ui/typography";

import TransactionsTable from "./transactions-table";
import AvailableRewards from "./available-rewards";

import type { StoreData } from "@/utils/crud";
import { useMainContext, type MainState } from "~/app/(main)/context/MainContext";

interface StoreProps {
    storeData: StoreData
}

function formatAddress(storeData: StoreData) {
    if (!storeData.address_line_1) return 'Address not available';

    return `${storeData.address_line_1},
${storeData.city} ${storeData.state} ${storeData.postcode}`;
}

function formatRate(rate: number) {
    return `Earn ${rate} point(s) for every $1 spend`;
}

export default function Store({ storeData }: StoreProps) {
    const { userData } = useMainContext() as MainState;

    const userPoints = useMemo(() => {
        // get user points for this store
        return userData.points.find((obj) => obj.store_id === storeData.id)?.balance || 0;
    }, [userData, storeData]);

    const storeTransactions = useMemo(() => {
        return userData.transactions.filter((obj) => obj.store_id === storeData.id) || [];
    }, [userData, storeData]);

    return (
        <ScrollView
            contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16, gap: 24, backgroundColor: 'rgb(241 245 249)' }}
            keyboardShouldPersistTaps='handled'
        >
            <View>
                <Card>
                    <CardContent className='flex items-center gap-2 p-6'>
                        <View className='w-full flex flex-row items-center justify-between'>
                            <View className='min-w-[120px] flex items-start justify-center rounded-xl border border-yellow-400 p-2'>
                                <Small>Points</Small>

                                <H1 className='font-semibold'>{Math.round(userPoints).toLocaleString()}</H1>
                            </View>

                            <Large className='max-w-[50%] font-display'>{formatRate(storeData.points_rate)}</Large>
                        </View>
                    </CardContent>
                </Card>
            </View>

            <View>
                <Card>
                    <CardContent className='flex items-center gap-2 p-6'>
                        <View className='w-full flex flex-row items-center justify-between'>
                            <Large>{'Location(s)'}</Large>

                            <Large className='max-w-[50%] font-display'>{formatAddress(storeData)}</Large>
                        </View>
                    </CardContent>
                </Card>
            </View>

            <View className='w-full flex flex-col gap-4'>
                <Large>Available Rewards</Large>

                <AvailableRewards storeID={storeData.id} />
            </View>

            <View className='w-full flex flex-col gap-4'>
                <Large>Recent Transactions</Large>

                <TransactionsTable data={storeTransactions} />
            </View>
        </ScrollView>
    )
}