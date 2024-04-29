import { Linking, SafeAreaView, ScrollView, View } from "react-native";
import { Stack, router } from "expo-router";

import { Button } from "~/components/ui/button";
import { Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { UserRound, LogOut } from "~/components/Icons";

import { supabase } from "@/lib/supabase";

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

import AccountList from "./components/account-list";
import ManageAccounts from "./components/manage-accounts";
import PersonalDetails from "./components/personal-details";

export default function Account() {
    const { session } = useGlobalContext() as GlobalState;

    const onLogout = () => {
        supabase.auth.signOut()
        .then(() => {
            router.replace('/login/');
        });
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    title: 'My Account'
                }}
            />
            <ScrollView
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'space-between', padding: 24, gap: 24 }} 
                keyboardShouldPersistTaps='handled'
            >
                <View className='w-full'>
                    <View className='flex flex-row items-center gap-2'>
                        <UserRound size={24} color='black' />

                        <Large>{session!.user.user_metadata['first_name'] + session!.user.user_metadata['last_name'] || 'Username'}</Large>
                    </View>
                </View>
                <View className='w-full flex gap-2'>
                    <View className='flex flex-row items-center justify-between'>
                        <Large>My Linked Cards</Large>

                        <ManageAccounts action='manage' />
                    </View>
                    
                    <View>
                        <AccountList />
                    </View>
                </View>
                
                <View className='w-full flex gap-2'>
                    <Large>My Details</Large>

                    <PersonalDetails />
                </View>

                <View className='w-full flex gap-2'>                    
                    <Button className='bg-yellow-400' onPress={() => Linking.openURL('mailto:info@loyaltyexchange.com.au?subject=Enquiry')}>
                        <Text>Contact Us</Text>
                    </Button>
                </View>
                
                <View className='w-full flex items-center pb-12'>
                    <Button onPress={onLogout}>
                        <View className='flex flex-row items-center gap-2'>
                            <Large className=''>Log out</Large>
                            <LogOut size={24} color='black' />
                        </View>
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}