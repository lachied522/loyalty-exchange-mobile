import { useState } from 'react';
import { Alert, View, SafeAreaView, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, Link, router } from 'expo-router';

import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { H1 } from '~/components/ui/typography';
import { cn } from '~/components/utils';

import { shadowStyles } from '~/constants/styling';

import { supabase } from '@/lib/supabase';

import { useStartContext, type StartState } from '../context/StartContext';

export default function Signup() {
    const { email, mobile, setEmail, setMobile, setSession } = useStartContext() as StartState;
    const [password, setPassword] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [formErrors, setFormErrors] = useState<{ [field: string]: string }>({});
    const [formIsValid, setFormIsValid] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const signUpWithEmail = async () => {
      setIsLoading(true);

      const { data:  { session }, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        phone: mobile,
        options: {
          // emailRedirectTo: redirectTo,
          data: {
            first_name: firstName,
            last_name: lastName,
            mobile,
          }
        }
      });

      if (error) {
        Alert.alert(error.message);
        setIsLoading(false);
        return;
      };

      setSession(session);
      // navigate to onboarding page
      router.replace('/(start)/onboarding');
    }

    const validateForm = () => {
      const errors: { [field: string]: string } = {};

      if (email.length === 0) {
        errors['email'] = 'Enter a valid email';
      }

      if (mobile.length === 0) {
        errors['mobile'] = 'Enter a valid mobile';
      }

      if (password.length === 0) {
        errors['password'] = 'Enter a valid password';
      }

      if (firstName.length === 0) {
        errors['firstName'] = 'Please provide your first name';
      }

      if (lastName.length === 0) {
        errors['lastName'] = 'Please provide your last name';
      }

      setFormErrors(errors);

      const isValid = Object.keys(errors).length === 0;
      setFormIsValid(isValid);

      return isValid;
    }

    const handleSubmit = () => {
        const isValid = validateForm();
        if (isValid) signUpWithEmail();
    }

    // const url = Linking.useURL();
    // if (url) createSessionFromUrl(url);

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
              <View className='w-full h-[50%] flex items-center justify-start'>
                <SafeAreaView>
                  <H1 className='p-12'>Welcome!</H1>
                </SafeAreaView>
              </View>

              <View className='w-full h-[50%] flex flex-col justify-end'>
                <View className='w-full h-full items-center justify-center bg-yellow-300 p-12 rounded-t-xl relative'>
                  <View className='w-full max-w-[360px] bg-white flex flex-col p-6 gap-6 rounded-xl top-[-50%] absolute' style={shadowStyles.edge}>
                    <View>
                      <Text>First Name</Text>
                      <Input
                        onChangeText={(text) => setFirstName(text)}
                        value={firstName}
                        autoCapitalize='none'
                        className={cn('border-black', firstName.length === 0 && !formIsValid && 'border-red-400')}
                      />
                    </View>

                    <View>
                      <Text>Last Name</Text>
                      <Input
                        onChangeText={(text) => setLastName(text)}
                        value={lastName}
                        autoCapitalize='none'
                        className={cn('border-black', lastName.length === 0 && !formIsValid && 'border-red-400')}
                      />
                    </View>

                    <View>
                      <Text>Email</Text>
                      <Input
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        autoCapitalize='none'
                        keyboardType='email-address'
                        className={cn('border-black', email.length === 0 && !formIsValid && 'border-red-400')}
                      />
                    </View>

                    <View>
                      <Text>Mobile</Text>
                      <Input
                        onChangeText={(text) => setMobile(text)}
                        value={mobile}
                        autoCapitalize='none'
                        keyboardType='phone-pad'
                        className={cn('border-black', mobile.length === 0 && !formIsValid && 'border-red-400')}
                      />
                    </View>

                    <View>
                      <Text>Password</Text>
                      <Input
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                        autoCapitalize='none'
                        className={cn('border-black', password.length === 0 && !formIsValid && 'border-red-400')}
                      />
                    </View>

                    <TouchableOpacity
                      disabled={isLoading}
                      onPress={handleSubmit}
                    >
                      <View className='w-full items-center bg-yellow-400 p-3 rounded-xl'>
                        {isLoading? (
                        <Text className='font-display-medium text-lg'>Please wait...</Text>
                        ) : (

                          <Text className='font-display-medium text-lg'>Sign Up</Text>
                        )}
                      </View>
                    </TouchableOpacity>

                    <View className='w-full flex items-center'>
                      <Text>Already have an account? <Link href='/login/' className='text-blue-400 underline'>Login</Link></Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
      </>
    )
}