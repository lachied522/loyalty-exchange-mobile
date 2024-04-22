import { useState, useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { Large } from '~/components/ui/typography';

import { fetchStoreData, type StoreData } from '~/app/utils/data-fetching';

import Store from '~/app/screens/(store)/store';

export default function StoreIDPage() {
    const { storeID } = useLocalSearchParams();
    const [data, setData] = useState<StoreData | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = false;

        fetchData();

        async function fetchData() {
            if (isMounted) return;
            
            fetchStoreData(storeID as string)
            .then((res) => setData(res))
            .finally(() => setIsLoading(false));

            isMounted = true;
        }
    }, []);

    return (
        <SafeAreaView>
            <Stack.Screen
                options={{
                    title: '',
                    headerBackTitle: 'Back',
                }}
            />
            {isLoading ? (
            <View>
                <Large>Loading...</Large>
            </View>
            ) : data ? (
                <Store data={data} />
            ) : (
            <View>
                <Large>Not Found</Large>
            </View>
            )}
        </SafeAreaView>
    )
}