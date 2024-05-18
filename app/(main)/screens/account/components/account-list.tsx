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
                .catch((e) => {
                    setError(true);
                })
                .then((accounts) => {
                    if (accounts) {
                        setAccounts(accounts);
                    }
                });
            }

            setIsLoading(false);
        }
    }, []);

    return (
        <View className='w-full flex bg-white gap-2 p-3 pt-6'>
            <H3>My Linked Cards</H3>

            <View className='min-h-[100px] p-3'>
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
                        <>
                            {isLoading ? (
                            <View className='w-full flex flex-col gap-4 py-2'>
                                <Skeleton className='h-14 w-full rounded-xl bg-neutral-200' />
                                <Skeleton className='h-14 w-full rounded-xl bg-neutral-200' />
                            </View>
                            ) : (
                            <View className='h-[180px] flex items-center justify-center py-6'>
                                {error ? (
                                <Large className='text-center'>There was an error fetching your accounts. Please try again later</Large>
                                ) : (
                                <Large className='text-center'>You don't have any linked accounts</Large>
                                )}
                            </View>
                            )}
                        </>
                    )}
                    ListFooterComponent={() => (
                        <View className='flex flex-row items-center justify-end'>
                            <ManageAccounts action='connect' isLoading={isLoading} setIsLoading={setIsLoading} />
                            <ManageAccounts action='manage' isLoading={isLoading} setIsLoading={setIsLoading} />
                        </View>
                    )}
                />
            </View>
        </View>
    )
}