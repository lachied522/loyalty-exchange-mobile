import { Linking, ScrollView, View } from "react-native";
import { Stack } from "expo-router";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

import { colors } from "~/constants/styling";

import AccountList from "./components/account-list";
import PersonalDetails from "./components/personal-details";
import LogoutButton from "./components/logout-button";
import AccountHeader from "./components/account-header";
import DeleteAccountButton from "./components/delete-account-button";

export default function Account() {

    return (
        <>
            <Stack.Screen
                options={{
                    header: AccountHeader
                }}
            />
            <ScrollView
                contentContainerStyle={{ ...colors.background, gap: 12 }}
                keyboardShouldPersistTaps='handled'
            >
                <AccountList />

                <PersonalDetails />

                <View className='w-full flex flex-col items-center justify-center bg-white p-6'>
                    <Button className='w-full bg-yellow-400 p-4' onPress={() => Linking.openURL('mailto:info@loyaltyexchange.com.au?subject=Enquiry')}>
                        <Text className='font-display-medium text-xl text-black'>Contact Us</Text>
                    </Button>
                </View>

                <View className='w-full flex flex-col items-center justify-center bg-white gap-6 p-6 pb-12'>
                    <LogoutButton />

                    <DeleteAccountButton />
                </View>
            </ScrollView>
        </>
    )
}