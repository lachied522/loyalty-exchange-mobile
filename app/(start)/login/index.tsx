import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, Link, router } from 'expo-router';
import { useToast } from 'react-native-toast-notifications';

import { supabase } from '@/lib/supabase';

import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { cn } from '~/components/utils';

import { shadowStyles } from '~/constants/constants';

import Logo from '~/components/Logo';

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
  } else if (error.message === 'User belongs to a client') {
    toast.show(
      `This login belongs to a store and can't be used.`,
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
        // check user role
        if (user && user.user_metadata['role'] === 'client') {
            // user belongs to a client
            handleLoginError(new Error('User belongs to a client'), toast);
            return;
        }

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
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView 
              contentContainerStyle={{ height: '100%' }}
              keyboardShouldPersistTaps='handled'
              scrollEnabled={false}
            >
              <View className='w-full h-[40%] flex items-center justify-center'>
                <Logo />
              </View>
              <View className='w-full h-[60%] flex flex-col justify-end'>
                <View className='w-full h-[60%] flex items-center justify-center bg-yellow-300 p-12 rounded-t-xl relative'>
                  <View className='w-full max-w-[360px] bg-white rounded-xl p-6 gap-6 top-[-60%] absolute'  style={shadowStyles.edge}>
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
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                        autoCapitalize='none'
                        className={cn('border-black', password.length === 0 && !formIsValid && 'border-red-400')}
                      />
                      <View className='w-full flex items-end'>
                        <Link href='/forgot-password/' className='text-blue-400 underline'>Forgot Password?</Link>
                      </View>
                    </View>

                    <View className='w-full items-center bg-yellow-400 p-4 rounded-xl'>
                      {isLoading? (
                      <Text className='font-display-medium text-lg'>Please wait...</Text>
                      ) : (
                      <TouchableOpacity
                          disabled={isLoading} 
                          onPress={handleSubmit}
                          className='w-full'
                      >
                        <Text className='font-display-medium text-lg'>Login</Text>
                      </TouchableOpacity>
                      )}
                    </View>
                    
                    <View className='w-full flex items-center'>
                      <Text>Don't have an account? <Link href='/signup/' className='text-blue-400 underline'>Create an account</Link></Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
      </>
    )
}