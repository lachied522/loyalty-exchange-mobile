import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { Stack } from "expo-router";

import { ExternalLink, LogOut } from "lucide-react-native";

import { Button } from "~/components/ui/button";
import { H1, H2, H3, Large } from "~/components/ui/typography";

import { supabase } from "@/lib/supabase";

export default function Account() {

    const onLogout = () => {
        supabase.auth.signOut(); // should automatically redirect user
    }

    return (
        <SafeAreaView style={{ flex: 1, marginBottom: 64 }}>
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
                    <H1>Account Page</H1>
                </View>

                <View className='w-full flex gap-6'>
                    <View className='flex flex-row justify-between'>
                        <H2>My Linked Cards</H2>

                        <View className='flex flex-row items-center gap-1'>
                            <Large>Manage</Large>
                            <ExternalLink size={18} color='black' />
                        </View>
                    </View>

                    <View>
                        <Large>Card</Large>
                    </View>
                </View>
                
                <Button onPress={onLogout}>
                    <View className='flex flex-row items-center gap-2'>
                        <H3 className='text-red-500'>Signout</H3>
                        <LogOut size={32} color='red' />
                    </View>
                </Button>
            </ScrollView>
        </SafeAreaView>
    )
}