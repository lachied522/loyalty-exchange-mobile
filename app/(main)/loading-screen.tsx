import { View } from "react-native";
import { Stack } from "expo-router";

import { Loader } from "~/components/Icons";
import Logo from "~/components/Logo";

export default function LoadingScreen() {

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View className='h-full flex flex-col items-center justify-center gap-12 bg-gray'>
                <Logo />
                <View className='animate-spin'>
                    <Loader size={24} color='black' />
                </View>
            </View>
        </>
    )
}