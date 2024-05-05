import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Stack, Link, useLocalSearchParams } from 'expo-router';

import { Large } from '~/components/ui/typography';

import { fetchStoresById } from '@/utils/crud';
import type { StoreData } from '@/types/helpers';

import { useMainContext, type MainState } from '../../context/MainContext';

import Store from './components/store-screen';
import NotFoundScreen from '~/app/+not-found';


export default function StoreIDPage() {
    const { storeData, setStoreData } = useMainContext() as MainState;
    const { storeID } = useLocalSearchParams() as { storeID: string };
    const [data, setData] = useState<StoreData | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = false;

        fetchData();

        async function fetchData() {
            if (isMounted) return;

            // check if store data already in state
            if (storeID in storeData) {
                setData(storeData[storeID]);
                setIsLoading(false);
            } else {
                fetchStoresById([storeID])
                .then((res) => {
                    if (res) setData(res[0] as StoreData);
                })
                .finally(() => setIsLoading(false));
            }
            
            isMounted = true;
        }
    }, []);

    return (
        <>
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