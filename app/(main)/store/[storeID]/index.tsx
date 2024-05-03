import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Stack, Link, useLocalSearchParams } from 'expo-router';

import { Button } from "~/components/ui/button";
import { Large } from '~/components/ui/typography';
import { ChevronLeft } from "~/components/Icons";

import { fetchStoresById, type StoreData } from '@/utils/crud';

import Store from './components/store-screen';
import NotFoundScreen from '~/app/+not-found';

export default function StoreIDPage() {
    const { storeID } = useLocalSearchParams();
    const [data, setData] = useState<StoreData | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = false;

        fetchData();

        async function fetchData() {
            if (isMounted) return;
            
            fetchStoresById([storeID as string])
            .then((res) => {
                if (res) setData(res[0]);
            })
            .finally(() => setIsLoading(false));

            isMounted = true;
        }
    }, []);

    return (
        <>
            <Stack.Screen
                options={{
                    title: data? data.name: '',
                    headerLeft: () => (
                        <View className='h-12 w-12 flex items-center justify-center rounded-[12] left-0'>
                            <Link href='/(main)/' asChild>
                                <Button>
                                    <ChevronLeft size={30} color='rgb(15 23 42)'/>
                                </Button>
                            </Link>
                        </View>
                    ),
                }}
            />
            {isLoading ? (
            <View className='flex-1 items-center justify-center'>
                <Large>Loading...</Large>
            </View>
            ) : data ? (
                <Store storeData={data} />
            ) : (
            <NotFoundScreen />
            )}
        </>
    )
}