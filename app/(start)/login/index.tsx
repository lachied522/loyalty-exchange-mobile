import { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, Link, router } from 'expo-router';
import * as Linking from 'expo-linking';

import { useToast } from 'react-native-toast-notifications';

import { supabase } from '@/lib/supabase';

import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { cn } from '~/components/utils';
import { ExternalLink } from "~/components/Icons";
import Logo from '~/components/Logo';

import { shadowStyles } from '~/constants/styling';

function handleLoginError(error: Error, toast: ReturnType<typeof useToast>) {
  if (error.message === 'Network request failed') {
    toast.show(
      'Internet access is required.',
      {
          placement: 'top',
          duration: 5000
      }
    )
  } else if (error.message === 'Invalid login credentials') {
    toast.show(
      'Username or password incorrect.',
      {
          placement: 'top',
          duration: 5000
      }
    )
  } else {
    toast.show(
      'Something went wrong. Please try again later.',
      {
          placement: 'top',
          duration: 5000
      }
    )
  }
}

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [field: string]: string }>({});
    const [formIsValid, setFormIsValid] = useState<boolean>(true);
    const toast = useToast();

    const signInWithEmail = async () => {
      setIsLoading(true);
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
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
                  headerShown: false
              }}
          />
          <ScrollView
            contentContainerStyle={{ height: '100%', position: 'relative' }}
            keyboardShouldPersistTaps='handled'
            scrollEnabled={false}
          >
            <View className='h-full flex flex-col items-center justify-center gap-12'>
              <View className='h-[40vh] w-full bg-yellow-300 bottom-0 absolute'/>

              <View className='w-full flex items-center justify-center p-12'>
                <Logo />
              </View>

              <View className='w-full max-w-[360px] bg-white rounded-xl p-6 gap-6'  style={shadowStyles.edge}>
                <View className='gap-1'>
                  <Text>Email</Text>
                  <Input
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    autoCapitalize='none'
                    keyboardType='email-address'
                    className={cn('border-black', email.length === 0 && !formIsValid && 'border-red-400')}
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
                    className={cn('border-black', password.length === 0 && !formIsValid && 'border-red-400')}
                  />
                  <View className='w-full flex items-end'>
                    <Link href='/forgot-password/' className='text-blue-400 underline'>Forgot Password?</Link>
                  </View>
                </View>

                <TouchableOpacity
                  disabled={isLoading}
                  onPress={handleSubmit}
                >
                  <View className='w-full items-center bg-yellow-400 p-3 rounded-xl'>
                    {isLoading? (
                    <Text className='font-display-medium text-lg text-black'>Please wait...</Text>
                    ) : (
                    <Text className='font-display-medium text-lg text-black'>Login</Text>
                    )}
                  </View>
                </TouchableOpacity>

                <View className='w-full flex items-center'>
                  <Text>Don't have an account? <Link href='/signup/' className='text-blue-400 underline'>Create an account</Link></Text>
                </View>

                <TouchableOpacity onPress={() => Linking.openURL('https://www.loyaltyexchange.com.au/stores')}>
                  <View className='w-full flex flex-row items-center justify-center gap-1'>
                    <Text>I am a store</Text>
                    <ExternalLink size={16} color='black' />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
      </>
    )
}