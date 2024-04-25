import { useState, useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Stack, Link, useLocalSearchParams } from 'expo-router';

import { ChevronLeft } from "lucide-react-native";

import { Button } from "~/components/ui/button";
import { Large } from '~/components/ui/typography';

import { fetchStoreData, type StoreData } from '@/utils/crud';

import Store from './components/store';

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
                    title: data? data.name: '',
                    headerLeft: () => (
                        <Link href='/home/' asChild>
                            <Button>
                                <ChevronLeft size={36} />
                            </Button>
                        </Link>
                    )
                }}
            />
            {isLoading ? (
            <View>
                <Large>Loading...</Large>
            </View>
            ) : data ? (
                <Store storeData={data} />
            ) : (
            <View>
                <Large>Not Found</Large>
            </View>
            )}
        </SafeAreaView>
    )
}