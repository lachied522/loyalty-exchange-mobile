import { useEffect, useState } from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { fetchUserAccounts } from "~/app/utils/functions";

import { H3, Large, Small } from "~/components/ui/typography";
import { Skeleton } from "~/components/ui/skeleton";

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
        fetchData();

        async function fetchData() {
            if (!accounts) {
                await fetchUserAccounts()
                .then((accounts) => setAccounts(accounts))
                .catch((e) => {
                    console.log(e);
                    setError(true);
                });
            }

            setIsLoading(false);
        }
    }, []);

    return (
        <View className='w-full flex bg-white gap-2 p-3'>
            <H3>My Linked Cards</H3>

            <View className='min-h-[100px] p-3'>
                {isLoading? (
                    <View className='w-full flex flex-col gap-4 py-2'>
                        <Skeleton className='h-14 w-full rounded-xl bg-neutral-400' />
                        <Skeleton className='h-14 w-full rounded-xl bg-neutral-400' />
                    </View>
                ) : (
                    <>
                        <View className='w-full flex flex-row justify-between p-3'>
                            <Small>Name</Small>
                            <Small>Number</Small>
                        </View>
                        <FlashList
                            data={accounts?.slice(0, 2) || []}
                            estimatedItemSize={45}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item: account, index }) => (
                                <View key={`accounts-${index}`} className='w-full flex flex-row justify-between p-3'>
                                    <Large className='font-display-semibold truncate'>{account.name}</Large>
                                    <Large>{maskAccountNumber(account.accountNo)}</Large>
                                </View>
                                )
                            }
                            ListEmptyComponent={() => (
                                <View className='h-[180px] flex flex-col items-center justify-center gap-2 py-6'>
                                    <Large>You don't have any linked accounts</Large>
                                </View>
                            )}
                            ListFooterComponent={() => (
                                <View className='flex flex-row items-center justify-end'>
                                    <ManageAccounts action='connect' isLoading={isLoading} setIsLoading={setIsLoading} />
                                    <ManageAccounts action='manage' isLoading={isLoading} setIsLoading={setIsLoading} />
                                </View>
                            )}
                        />
                    </>
                )}
            </View>
        </View>
    )
}