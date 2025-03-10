import { useState } from "react";
import { View, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Link, Stack } from "expo-router";

import { Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { ChevronLeft } from "~/components/Icons";

import { supabase } from "~/app/lib/supabase";
import { useCustomToast } from "~/app/hooks/useCustomToast";

function handleError(error: Error, toast: ReturnType<typeof useCustomToast>) {
    if (error.message === 'Network request failed') {
        toast.show('Internet access is required.');
    } else {
        toast.show('Something went wrong. Please try again later.');
    }
}

export default function ForgotPassword() {
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const toast = useCustomToast();

    const sendEmail = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(
            email,
            {
                redirectTo: 'https://www.loyaltyexchange.com.au/reset-password',
            }
        );

        if (error) {
            handleError(error, toast);
        } else {
            setIsSuccess(true);
        }

        setIsLoading(false);
    }

    return (
        <SafeAreaView>
            <Stack.Screen
                options={{
                    headerTitle: '',
                    headerLeft: () => (
                        <Link href='/login/' asChild>
                            <TouchableOpacity>
                                <View className='h-12 w-12 flex items-center justify-center rounded-[12] left-0'>
                                    <ChevronLeft size={30} color='rgb(15 23 42)'/>
                                </View>
                            </TouchableOpacity>
                        </Link>

                    ),
                }}
                
            />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    contentContainerStyle={{ height: '100%', alignItems:'center', justifyContent: 'center', padding: 24 }}
                    keyboardShouldPersistTaps='handled'
                    scrollEnabled={false}
                >
                    <View className='max-w-[360px] flex flex-col gap-6'>
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

                        {isSuccess? (
                        <View className='w-full items-center p-3'>
                            <Text>Thanks, please check your email.</Text>
                        </View>
                        ) : (
                        <TouchableOpacity
                            disabled={isLoading}
                            onPress={sendEmail}
                        >
                            <View className='w-full items-center bg-yellow-400 p-3 rounded-xl'>
                                {isLoading? (
                                <Text>Please wait...</Text>
                                ) : (
                                <Text>Send Email</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}