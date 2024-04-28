import { SafeAreaView, ScrollView, View } from "react-native";
import { Stack, router } from "expo-router";

import { ExternalLink, LogOut } from "lucide-react-native";

import { Button } from "~/components/ui/button";
import { H1, H2, H3, Large } from "~/components/ui/typography";

import { supabase } from "@/lib/supabase";

export default function Account() {

    const onLogout = () => {
        supabase.auth.signOut();

        console.log('logged out')

        router.replace('/welcome/');
    }

    return (
        <SafeAreaView style={{ flex: 1, marginBottom: 64 }}>
            <Stack.Screen
                options={{
                    title: 'My Account'
                }}
            />
            <ScrollView
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'space-between', padding: 24, gap: 24 }} 
                keyboardShouldPersistTaps='handled'
            >
                <View className='w-full flex gap-6'>
                    <View className='flex flex-row justify-between'>
                        <H2>My Linked Cards</H2>

                        <View className='flex flex-row items-center gap-2'>
                            <Large>Manage</Large>
                            <ExternalLink size={20} color='black' />
                        </View>
                    </View>

                    <View>
                        <Large>Card</Large>
                    </View>
                </View>
                
                <Button onPress={onLogout}>
                    <View className='h-[50px] flex flex-row items-center gap-2'>
                        <H3 className=''>Log out</H3>
                        <LogOut size={24} color='black' />
                    </View>
                </Button>
            </ScrollView>
        </SafeAreaView>
    )
}