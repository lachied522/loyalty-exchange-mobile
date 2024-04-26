import { ScrollView, View } from "react-native";

import { H1, H3, Large, Small } from "~/components/ui/typography";

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

import TransactionsTable from "./transactions-table";
import RewardProgress from "./reward-progress";

import type { StoreData } from "@/utils/crud";
import { useMemo } from "react";

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
    const { userData } = useGlobalContext() as GlobalState;

    const userPoints = useMemo(() => {
        // get user points for this store
        return userData.points.find((obj) => obj.store_id === storeData.id)?.balance || 0;
    }, [userData, storeData]);

    const userTransactions = useMemo(() => {
        return userData.transactions.filter((obj) => obj.store_id === storeData.id) || [];
    }, [userData, storeData]);

    return (
        <ScrollView
            contentContainerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'space-between', padding: 24, gap: 64, marginTop: 24 }}
            keyboardShouldPersistTaps='handled'
        >
            <View className='w-full flex flex-col items-start gap-6'>
                <View className='min-w-[120px] flex items-start justify-center rounded-xl border border-yellow-400 gap-2 p-2'>
                    <H1 className='font-semibold'>{Math.round(userPoints).toLocaleString()}</H1>

                    <Small className='max-w-[40%]'>{storeData.name} Points</Small>
                </View>

                <View className='w-full flex flex-row items-start justify-between'>
                    <Large>{'Location(s)'}</Large>

                    <Large className='max-w-[50%] font-display'>{formatAddress(storeData)}</Large>
                </View>

                <View className='w-full flex flex-row items-start justify-between'>
                    <Large>Points</Large>

                    <Large className='max-w-[50%] font-display'>{formatRate(storeData.points_rate)}</Large>
                </View>
            </View>

            <View className='w-full flex flex-col items-center justify-center gap-6'>
                <H3>Rewards Available</H3>

                <RewardProgress userPoints={userPoints} storeData={storeData} />
            </View>

            <View className='w-full flex flex-col items-center justify-center gap-6'>
                <H3>My Recent Transactions</H3>

                <TransactionsTable data={[]} />
            </View>
        </ScrollView>
    )
}