import { useEffect, useState } from 'react';
import { Alert, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, Link, router } from 'expo-router';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { H1 } from '~/components/ui/typography';
import { cn } from '~/components/utils';

import { supabase } from '@/lib/supabase';

import { useStartContext, type StartState } from '../context/StartContext';

export default function Signup() {
    const { email, mobile, setEmail, setMobile } = useStartContext() as StartState;
    const [password, setPassword] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [formErrors, setFormErrors] = useState<{ [field: string]: string }>({});
    const [formIsValid, setFormIsValid] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
  
    const signUpWithEmail = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
  
      if (error) {
        Alert.alert(error.message);
        setLoading(false);
        return;
      };
      
      // navigate to onboarding page
      router.replace('/onboarding/');
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
  
    return (
        <SafeAreaView>
          <Stack.Screen
              options={{
                  headerShown: false
              }}
          />
          <ScrollView
            contentContainerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'flex-start', padding: 24, gap: 32 }}
            keyboardShouldPersistTaps='handled'
            scrollEnabled={false}
          >
            <H1>Welcome!</H1>

            <View className='w-full flex flex-col gap-6'>
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
                  autoCapitalize={'none'}
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

              <View className='w-full items-center bg-yellow-400 p-4 rounded-xl'>
                <TouchableOpacity
                  disabled={loading}
                  onPress={handleSubmit}
                >
                  <Text>Sign Up</Text>
                </TouchableOpacity>
              </View>

              <View className='w-full flex items-center'>
                <Text>Already have an account? <Link href='/login/' className='text-blue-400 underline'>Login</Link></Text>
              </View>
            </View>
          </ScrollView>
      </SafeAreaView>
    )
}