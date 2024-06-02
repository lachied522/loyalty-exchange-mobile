import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform  } from 'react-native';
import { Stack, Link, router } from 'expo-router';
import * as Linking from 'expo-linking';

import { supabase } from '~/app/lib/supabase';

import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { cn } from '~/components/utils';
import { ExternalLink } from "~/components/Icons";
import Logo from '~/components/Logo';

import { shadowStyles } from '~/constants/styling';

import { useCustomToast } from '~/app/hooks/useCustomToast';

import OAuthSigninButton from './components/oauth-signin-button';
import AppleSigninButton from './components/apple-signin-button';
import GuestSigninDialog from './components/guest-signin-dialog';

function handleLoginError(error: Error, toast: ReturnType<typeof useCustomToast>) {
  if (error.message === 'User cancelled') {
    // this occurs when user cancels OAuth flow, okay to pass
  } else if (error.message === 'Network request failed') {
    toast.show('Internet access is required.');
  } else if (error.message === 'Invalid login credentials') {
    toast.show('Username or password incorrect.');
  } else {
    toast.showUnknownError();
  }
}

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<{ [field: string]: string }>({});
    const [formIsValid, setFormIsValid] = useState<boolean>(true);
    const toast = useCustomToast();

    const signInWithEmail = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        handleLoginError(error, toast);
        setIsLoading(false);
      } else {
        // navigate to home page
        router.replace('/');
      }
    }

    const validateForm = () => {
      const errors: { [field: string]: string } = {};
      if (email.length === 0) {
        errors['email'] = '';
      }

      if (password.length === 0) {
        errors['password'] = '';
      }

      setFormErrors(errors);

      const isValid = Object.keys(errors).length === 0;
      setFormIsValid(isValid);

      return isValid;
    }

    const handleSubmit = () => {
      const isValid = validateForm();
      if (isValid) signInWithEmail();
    }

    return (
      <>
          <Stack.Screen
              options={{
                  headerShown: false,
                  gestureEnabled: false,
              }}
          />
          <View className='h-[100vh] w-full bg-yellow-200 bottom-0 absolute'/>
          <ScrollView
            contentContainerStyle={{ height: '100%' }}
            keyboardShouldPersistTaps='handled'
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className='h-full flex flex-col items-center justify-center'
            >
              <View className='w-full flex flex-col max-w-[360px] bg-white rounded-xl p-8 gap-5'  style={shadowStyles.edge}>
                <Logo />

                <View className='flex flex-col gap-3.5 mb-6'>
                  <AppleSigninButton handleError={(e: Error) => handleLoginError(e, toast)} />
                  <OAuthSigninButton provider='google' handleError={(e: Error) => handleLoginError(e, toast)} />
                  <OAuthSigninButton provider='facebook' handleError={(e: Error) => handleLoginError(e, toast)} />

                  <GuestSigninDialog handleError={(e: Error) => handleLoginError(e, toast)}>
                      <TouchableOpacity disabled={isLoading}>
                          <View className='min-h-[48px] w-full items-center justify-center bg-neutral-50 rounded-xl'>
                            <Text className='font-display-medium'>Continue as guest</Text>
                          </View>
                      </TouchableOpacity>
                  </GuestSigninDialog>
                </View>

                <View className='flex flex-row items-center justify-between'>
                  <View className='flex-1 h-[1px] bg-neutral-200' />
                  <Text className='flex-[0.25] font-display-medium text-lg text-neutral-400 text-center'>or</Text>
                  <View className='flex-1 h-[1px] bg-neutral-200' />
                </View>

                <View className='flex flex-col gap-3.5'>
                  <View className='gap-1'>
                    <Text>Email</Text>
                    <Input
                      onChangeText={(text) => setEmail(text)}
                      value={email}
                      autoCapitalize='none'
                      keyboardType='email-address'
                      className={cn('min-h-[48px] border-black', email.length === 0 && !formIsValid && 'border-red-400')}
                    />
                  </View>

                  <View className='flex flex-col gap-1'>
                    <Text>Password</Text>
                    <Input
                      value={password}
                      onChangeText={(text) => setPassword(text)}
                      onSubmitEditing={handleSubmit}
                      secureTextEntry={true}
                      autoCapitalize='none'
                      className={cn('min-h-[48px] border-black', password.length === 0 && !formIsValid && 'border-red-400')}
                    />
                  </View>

                  <View className='w-full flex items-end'>
                      <Link href='/forgot-password/' className='text-blue-400 underline'>Forgot Password?</Link>
                  </View>

                  <TouchableOpacity
                    disabled={isLoading}
                    onPress={handleSubmit}
                  >
                    <View className='min-h-[48px] w-full items-center justify-center bg-yellow-400 p-3 rounded-xl'>
                      <Text className='font-display-medium text-lg text-black'>{isLoading? 'Please wait...': 'Login'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View className='w-full flex items-center'>
                  <Text>Don't have an account? <Link href='/signup/' push className='text-blue-400 underline'>Create an account</Link></Text>
                </View>

                <TouchableOpacity onPress={() => Linking.openURL('https://www.loyaltyexchange.com.au/stores')}>
                  <View className='min-h-[48px] w-full flex flex-row items-center justify-center gap-1'>
                    <Text>I am a store</Text>
                    <ExternalLink size={16} color='black' />
                  </View>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
      </>
    )
}