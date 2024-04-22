import { SafeAreaView, ScrollView, View, Button } from "react-native";
import { Stack } from "expo-router";

import { H1 } from "~/components/ui/typography";

import type { StoreData } from "~/app/utils/data-fetching";

interface StoreProps {
    data: StoreData
}

export default function Store({ data }: StoreProps) {

    return (
        <SafeAreaView>
            <Stack.Screen
                options={{
                    title: '',
                    headerBackTitle: 'Back',
                }}
            />
            <ScrollView
                contentContainerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'space-between', padding: 24 }} 
                keyboardShouldPersistTaps='handled'
            >
                <View className='w-full flex flex-row items-center justify-center'>
                    <H1>{data.name}</H1>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}