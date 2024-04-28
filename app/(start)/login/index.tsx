import { useState } from 'react';
import { Alert, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack, Link, router } from 'expo-router';

import { supabase } from '@/lib/supabase';

import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { cn } from '~/components/utils';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [field: string]: string }>({});
    const [formIsValid, setFormIsValid] = useState<boolean>(true);
  
    const signInWithEmail = async () => {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
  
      if (error) {
        Alert.alert(error.message);
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
            contentContainerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'flex-end' }}
            keyboardShouldPersistTaps='handled'
            scrollEnabled={false}
          >
            <View className='w-full h-[40%] flex flex-col items-center bg-yellow-300 p-12 rounded-t-xl gap-2 relative'>
              <View className='bg-white rounded-xl p-6 gap-6 top-[-60%] absolute'>
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
                  <Text>Please wait...</Text>
                  ) : (
                  <TouchableOpacity
                      disabled={isLoading} 
                      onPress={handleSubmit}
                      className='w-full'
                  >
                      <Text>Login</Text>
                  </TouchableOpacity>
                  )}
                </View>
                <View className='w-full flex items-center'>
                  <Text>Don't have an account? <Link href='/signup/' className='text-blue-400 underline'>Create an account</Link></Text>
                </View>
              </View>
            </View>
          </ScrollView>
      </>
    )
}