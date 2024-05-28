import { View } from "react-native";
import { Stack } from "expo-router";

import { Large } from "~/components/ui/typography";

import StoreHeader from "./store-header";

export default function LoadingScreen() {

    return (
        <>
            <Stack.Screen
                options={{
                    header: () => <StoreHeader points={0} />
                }}
            />
            <View className='flex-1 items-center justify-center'>
                <Large className='mb-24'>Loading...</Large>
            </View>
        </>
    )
}