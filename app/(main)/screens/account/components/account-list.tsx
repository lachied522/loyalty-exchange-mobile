import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { fetchUserAccounts } from "~/app/utils/functions";

import { H3, Large, Small } from "~/components/ui/typography";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { RefreshCw } from "~/components/Icons";

import ManageAccountButton from "./manage-account-button";

import type { Account } from "@/types/basiq";

function maskAccountNumber(accountNo: string) {
    const length = accountNo.length;
    return '*'.repeat(length - 4) + accountNo.slice(length - 4);
}

export default function AccountList() {
    const [accounts, setAccounts] = useState<Account[] | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [isActionButtonsDisabled, setIsActionButtonsDisabled] = useState<boolean>(false);
    const [isRefreshButtonVisible, setIsRefreshButtonVisible] = useState<boolean>(false);

    async function fetchData() {
        setIsLoading(true);

        await fetchUserAccounts()
        .catch((e) => {
            setError(true);
        })
        .then((accounts) => {
            if (accounts) {
                setAccounts(accounts);
            }
        })
        .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        // fetch data on mount
        if (!accounts) {
            fetchData();
        }
    }, []);

    const onRefresh = async () => {
        // hide refresh button and disabled action buttons while fetching data
        setIsRefreshButtonVisible(false);
        setIsActionButtonsDisabled(true);
        await fetchData()
        .then(() => {
            setIsActionButtonsDisabled(false);
        });
    }

    return (
        <View className='w-full flex bg-white gap-2 p-3 pt-6'>
            <H3>My Linked Accounts</H3>

            <View className='min-h-[100px] p-3'>               
                <FlashList
                    data={accounts?.slice(0, 5) || []}
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
                        <View className='w-full h-[160px] flex flex-col justify-center py-6 gap-4'>
                            {isLoading ? (
                            <>
                                <Skeleton className='h-14 w-full rounded-xl bg-neutral-200' />
                                <Skeleton className='h-14 w-full rounded-xl bg-neutral-200' />
                            </>
                            ) : (
                            <>
                                {error ? (
                                <>
                                    <Large className='text-center'>There was an error fetching your accounts.</Large>
                                    <Text className='text-center'>Please try again later.</Text>
                                </>
                                ) : (
                                <>
                                    <Large className='text-center'>You don't have any linked accounts.</Large>
                                    <Text className='text-center'>Add a new account below.</Text>
                                </>
                                )}
                            </>
                            )}
                        </View>
                    )}
                    ListFooterComponent={() => (
                        <View className='flex flex-row items-center justify-end gap-3.5'>
                            {isRefreshButtonVisible ? (
                            <TouchableOpacity onPress={onRefresh}>
                                <View className='flex flex-row items-center gap-2 opacity-100'>
                                    <RefreshCw size={16} color='black' />
                                    <Large>Refresh</Large>
                                </View>
                            </TouchableOpacity>
                            ) : (
                            <>
                                <ManageAccountButton
                                    action='manage'
                                    disabled={isActionButtonsDisabled || isLoading || !accounts || !accounts.length} // cannot manage accounts if none exist
                                    onStartNewRequest={() => setIsActionButtonsDisabled(true)}
                                    onSuccess={() => setIsRefreshButtonVisible(true)}
                                    onError={() => setIsRefreshButtonVisible(true)}
                                />
                                <ManageAccountButton
                                    action='connect'
                                    disabled={isActionButtonsDisabled || isLoading}
                                    onStartNewRequest={() => setIsActionButtonsDisabled(true)}
                                    onSuccess={() => setIsRefreshButtonVisible(true)}
                                    onError={() => setIsRefreshButtonVisible(true)}
                                />
                            </>
                            )}
                        </View>
                    )}
                />
            </View>
        </View>
    )
}