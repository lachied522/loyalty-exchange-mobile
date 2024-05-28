import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { fetchStoresById } from '@/utils/crud';
import type { StoreData } from '@/types/helpers';

import { useMainContext, type MainState } from '../../context/MainContext';

import LoadingScreen from './components/loading-screen';
import StoreScreen from './components/store-screen';
import NotFoundScreen from '~/app/+not-found';

export default function StoreIDPage() {
    const { storeDataMap, setStoreDataMap } = useMainContext() as MainState;
    const { storeID } = useLocalSearchParams() as { storeID: string };
    const [data, setData] = useState<StoreData | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = false;

        fetchData();

        async function fetchData() {
            if (isMounted) return;

            // check if store data already in state
            if (storeID in storeDataMap) {
                setData(storeDataMap[storeID]);
                setIsLoading(false);
            } else {
                fetchStoresById([storeID])
                .then((res) => {
                    if (res) {
                        const _data = res[0] as StoreData;
                        setData(_data);
                        // add data to global store map so it does not have to be refetched
                        setStoreDataMap((curr) => ({ ...curr, [_data.id]: _data }));
                    };
                })
                .finally(() => setIsLoading(false));
            }
            
            isMounted = true;
        }
    }, []);

    return (
        <>
            {isLoading ? (
            <LoadingScreen />
            ) : data ? (
            <StoreScreen storeData={data} />
            ) : (
            <NotFoundScreen />
            )}
        </>
    )
}