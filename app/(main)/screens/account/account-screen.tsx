import { Linking, ScrollView, View } from "react-native";
import { Stack } from "expo-router";

import { Button } from "~/components/ui/button";
import { Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";

import { colors } from "~/constants/constants";

import AccountList from "./components/account-list";
import PersonalDetails from "./components/personal-details";
import LogoutButton from "./components/logout-button";
import AccountHeader from "./components/account-header";

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

                <View className='w-full flex flex-col items-center justify-center bg-white p-6 gap-6'>
                    <View className='w-full flex gap-2'>                    
                        <Button className='bg-yellow-400' onPress={() => Linking.openURL('mailto:info@loyaltyexchange.com.au?subject=Enquiry')}>
                            <Text>Contact Us</Text>
                        </Button>
                    </View>
                    
                    <LogoutButton />
                </View>
            </ScrollView>
        </>
    )
}