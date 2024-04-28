import { useState } from "react";
import { View, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { Link, Stack } from "expo-router";

import { supabase } from "@/lib/supabase";

import { Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { ChevronLeft } from "~/components/Icons";

export default function ForgotPassword() {
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const sendEmail = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://example.com/account/update-password',
        });
        console.log('error', error);
    }

    return (
        <SafeAreaView>
            <Stack.Screen
                options={{
                    headerTitle: '',
                    headerLeft: () => (
                        <View className='h-12 w-12 flex items-center justify-center rounded-[12] left-0'>
                            <Link href='/login/' asChild>
                                <ChevronLeft size={30} color='rgb(15 23 42)'/>
                            </Link>
                        </View>
                    ),
                }}
                
            />
            <ScrollView 
                contentContainerStyle={{ height: '100%', justifyContent: 'center', padding: 24 }}
                keyboardShouldPersistTaps='handled'
                scrollEnabled={false}
            >
                <View className='flex flex-col gap-6'>
                    <View className='gap-2'>
                        <Large>Reset Password</Large>
                        <Text>Send an email to reset your password</Text>
                    </View>
                    <View className='gap-1'>
                        <Text>Email</Text>
                        <Input
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            placeholder="email@address.com"
                            autoCapitalize='none'
                            keyboardType='email-address'
                        />
                    </View>
                    <View className='w-full items-center bg-yellow-400 p-4 rounded-xl'>
                        <TouchableOpacity
                            disabled={isLoading}
                            onPress={sendEmail}
                        >
                            <Text>Send Email</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}