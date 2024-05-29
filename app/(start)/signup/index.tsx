import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, Link, router } from 'expo-router';

import { useToast } from 'react-native-toast-notifications';

import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { H1 } from '~/components/ui/typography';
import { cn } from '~/components/utils';

import { shadowStyles } from '~/constants/styling';

import { supabase } from '@/lib/supabase';

import { useStartContext, type StartState } from '../context/StartContext';

type SignupData = {
  first_name: string,
  last_name: string,
  email: string,
  mobile: string,
  password: string,
}

function handleSignupError(error: Error, toast: ReturnType<typeof useToast>) {
  if (error.message === 'Network request failed') {
    toast.show(
      'Internet access is required.',
      {
          placement: 'top',
          duration: 5000
      }
    )
  } else if (error.message === 'User already registered') {
    toast.show(
      'An account already exists with this email.',
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

function getFormErrors(data: SignupData) {
    const errors: { [field: string]: string } = {};

    if (data.first_name.length === 0) {
      errors.first_name = 'Please provide your first name.';
    }

    if (data.last_name.length === 0) {
      errors.last_name = 'Please provide your last name.';
    }

    if (data.email.length === 0 || !data.email.includes('@')) {
      errors.email = 'Enter a valid email.';
    }

    if (data.mobile.length < 10) {
      errors.mobile = 'Enter a valid mobile.';
    }

    if (data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    return errors;
}

export default function Signup() {
    const { setSession } = useStartContext() as StartState;
    const [formState, setFormState] = useState<SignupData>({
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState<{ [field: string]: string | null }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useToast();

    const signUpWithEmail = async () => {
        setIsLoading(true);

        const { data:  { session }, error } = await supabase.auth.signUp({
          email: formState.email,
          password: formState.password,
          options: {
            // emailRedirectTo: redirectTo,
            data: {
              first_name: formState.first_name,
              last_name: formState.last_name,
              mobile: formState.mobile,
            }
          }
        });

        if (error) {
          handleSignupError(error, toast);
          setIsLoading(false);
          return;
        };

        setSession(session);
        // navigate to onboarding page
        router.replace('/(start)/onboarding');
    }

    const handleSubmit = () => {
        const errors = getFormErrors(formState);
        if (Object.keys(errors).length === 0) {
            signUpWithEmail();
        } else {
          setFormErrors(errors);
        };
    }

    const onFieldChange = (field: string, value: string) => {
        // update field and reset errors
        setFormState((curr) => ({ ...curr, [field]: value }));
        setFormErrors((curr) => ({ ...curr, [field]: null }));
    }

    return (
        <>
          <Stack.Screen
              options={{
                  headerShown: false,
                  gestureEnabled: false
              }}
          />
          <View className='h-[50vh] w-full bg-yellow-300 bottom-0 absolute'/>

          <ScrollView
            contentContainerStyle={{ height: '100%', marginBottom: 24 }}
            keyboardShouldPersistTaps='handled'
            scrollEnabled={false}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className='h-full flex flex-col items-center justify-center gap-12'
            >
              <View className='w-full flex items-center justify-center'>
                  <H1 className='p-12'>Welcome!</H1>
              </View>

              <View className='w-full max-w-[360px] bg-white flex flex-col p-6 gap-6 rounded-xl' style={shadowStyles.edge}>
                <View>
                  <Text>First Name</Text>
                  <Input
                      onChangeText={(text) => onFieldChange('first_name', text)}
                      value={formState.first_name}
                      autoCapitalize='none'
                      className={cn('border-black', formErrors.first_name && 'border-red-400')}
                  />
                  {formErrors.first_name && <Text className='text-red-400'>{formErrors.first_name}</Text>}
                </View>

                <View>
                  <Text>Last Name</Text>
                  <Input
                      onChangeText={(text) => onFieldChange('last_name', text)}
                      value={formState.last_name}
                      autoCapitalize='none'
                      className={cn('border-black', formErrors.last_name && 'border-red-400')}
                  />
                  {formErrors.last_name && <Text className='text-red-400'>{formErrors.last_name}</Text>}
                </View>

                <View>
                  <Text>Email</Text>
                  <Input
                      onChangeText={(text) => onFieldChange('email', text)}
                      value={formState.email}
                      autoCapitalize='none'
                      keyboardType='email-address'
                      className={cn('border-black', formErrors.email && 'border-red-400')}
                  />
                  {formErrors.email && <Text className='text-red-400'>{formErrors.email}</Text>}
                </View>
                
                <View>
                  <Text>Mobile</Text>
                  <Input
                      onChangeText={(text) => onFieldChange('mobile', text)}
                      value={formState.mobile}
                      autoCapitalize='none'
                      keyboardType='phone-pad'
                      className={cn('border-black', formErrors.mobile && 'border-red-400')}
                  />
                  {formErrors.mobile && <Text className='text-red-400'>{formErrors.mobile}</Text>}
                </View>

                <View>
                  <Text>Password</Text>
                  <Input
                      value={formState.password}
                      onChangeText={(text) => onFieldChange('password', text)}
                      onSubmitEditing={handleSubmit}
                      secureTextEntry={true}
                      autoCapitalize='none'
                      className={cn('border-black', formErrors.password && 'border-red-400')}
                  />
                  {formErrors.password && <Text className='text-red-400'>{formErrors.password}</Text>}
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
            </KeyboardAvoidingView>
          </ScrollView>
      </>
    )
}