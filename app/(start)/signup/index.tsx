import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, Link, router } from 'expo-router';

import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { H1, Small } from '~/components/ui/typography';
import { cn } from '~/components/utils';

import { shadowStyles } from '~/constants/styling';

import { supabase } from '~/app/lib/supabase';

import { useCustomToast } from '~/app/hooks/useCustomToast';

type SignupData = {
  first_name: string,
  last_name: string,
  email: string,
  mobile: string,
  password: string,
}

function handleSignupError(error: Error, toast: ReturnType<typeof useCustomToast>) {
  if (error.message === 'Network request failed') {
    toast.show('Internet access is required.');
  } else if (error.message === 'User already registered') {
    toast.show('An account already exists with this email.');
  } else {
    toast.showUnknownError();
  }
}

function getFormErrors(data: SignupData) {
    const errors: { [field: string]: string } = {};

    // if (data.first_name.length === 0) {
    //   errors.first_name = 'Please provide your first name.';
    // }

    // if (data.last_name.length === 0) {
    //   errors.last_name = 'Please provide your last name.';
    // }

    if (
      (data.email.length > 0 && data.email.length < 6) ||
      !data.email.includes('@')
    ) {
      errors.email = 'Please provide a valid email.';
    }

    if (data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    return errors;
}

export default function Signup() {
    const [formState, setFormState] = useState<SignupData>({
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState<{ [field: string]: string | null }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useCustomToast();

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
                role: 'user'
            }
          }
        });

        if (error) {
          handleSignupError(error, toast);
          setIsLoading(false);
          return;
        };

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
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className='h-full flex flex-col items-center justify-center gap-12'
            >
              <View className='w-full max-w-[360px] bg-white flex flex-col p-8 gap-5 rounded-xl' style={shadowStyles.edge}>
                <H1 className='text-center'>Welcome!</H1>
                
                <View>
                  <Text>First Name</Text>
                  <Input
                      onChangeText={(text) => onFieldChange('first_name', text)}
                      value={formState.first_name}
                      autoCapitalize='none'
                      className={cn('min-h-[48px] border-black', formErrors.first_name && 'border-red-400')}
                  />
                  {formErrors.first_name && <Text className='text-red-400'>{formErrors.first_name}</Text>}
                </View>

                <View>
                  <Text>Last Name</Text>
                  <Input
                      onChangeText={(text) => onFieldChange('last_name', text)}
                      value={formState.last_name}
                      autoCapitalize='none'
                      className={cn('min-h-[48px] border-black', formErrors.last_name && 'border-red-400')}
                  />
                  {formErrors.last_name && <Text className='text-red-400'>{formErrors.last_name}</Text>}
                </View>
                
                <View>
                  <Text>Mobile</Text>
                  <Input
                      onChangeText={(text) => onFieldChange('mobile', text)}
                      value={formState.mobile}
                      autoCapitalize='none'
                      keyboardType='phone-pad'
                      className={cn('min-h-[48px] border-black', formErrors.mobile && 'border-red-400')}
                  />
                  {formErrors.mobile && <Text className='text-red-400'>{formErrors.mobile}</Text>}
                </View>

                <View>
                  <Text>Email <Small>(required)</Small></Text>
                  <Input
                      onChangeText={(text) => onFieldChange('email', text)}
                      value={formState.email}
                      autoCapitalize='none'
                      keyboardType='email-address'
                      className={cn('min-h-[48px] border-black', formErrors.email && 'border-red-400')}
                  />
                  {formErrors.email && <Text className='text-red-400'>{formErrors.email}</Text>}
                </View>

                <View>
                  <Text>Password <Small>(required)</Small></Text>
                  <Input
                      value={formState.password}
                      onChangeText={(text) => onFieldChange('password', text)}
                      onSubmitEditing={handleSubmit}
                      secureTextEntry={true}
                      autoCapitalize='none'
                      className={cn('min-h-[48px] border-black', formErrors.password && 'border-red-400')}
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