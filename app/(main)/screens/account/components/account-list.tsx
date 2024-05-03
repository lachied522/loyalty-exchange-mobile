import { useEffect, useState } from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { fetchUserAccounts } from "@/utils/fetching";

import { Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";

import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent } from "~/components/ui/card";

import ManageAccounts from "./manage-accounts";

import type { Account } from "@/types/basiq";


function maskAccountNumber(accountNo: string) {
    const length = accountNo.length;
    return '*'.repeat(length - 4) + accountNo.slice(length - 4);
}

export default function AccountList() {
    const [accounts, setAccounts] = useState<Account[] | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            if (!accounts) {
                const data = await fetchUserAccounts();

                console.log('data', data);

                setAccounts(data);
            }
        }

        fetchData()
        .catch((e) => {
            console.log(e);
            setError(true);
        })
        .finally(() => setIsLoading(false));        
    }, []);

    return (
        <Card>
            <CardContent className='min-h-[100px] py-1'>
                {isLoading? (
                    <View className='w-full flex flex-col gap-4 py-2'>
                        <Skeleton className='h-14 w-full rounded-xl bg-slate-4 bg-slate-100' />
                        <Skeleton className='h-14 w-full rounded-xl bg-slate-100' />
                    </View>
                ) : (
                    <FlashList
                        data={accounts?.slice(0, 2) || []}
                        estimatedItemSize={45}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View className='w-full border-b border-slate-300'/>}
                        renderItem={({ item: account, index }) => (
                            <View key={`accounts-${index}`} className='w-full flex flex-row justify-between py-6'>
                                <Large className='font-display-semibold truncate'>{account.name}</Large>
                                <Large>{maskAccountNumber(account.accountNo)}</Large>
                            </View>
                            )
                        }
                        ListEmptyComponent={() => (
                            <View className='h-[180px] flex flex-col items-center justify-center gap-2 py-6'>
                                <Large>You don't have any linked accounts</Large>
                                <ManageAccounts action='connect' />
                            </View>
                        )}
                    />
                )}
            </CardContent>
        </Card>
    )
}