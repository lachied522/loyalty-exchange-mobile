import { Redirect, Stack } from "expo-router";


export default function MainIndex() {

    return <Redirect href='/home/' />

    return (
        <Stack.Screen
            options={{
                headerShown: false
            }}
        />
    )
}