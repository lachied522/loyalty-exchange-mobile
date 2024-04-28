import { useState, useEffect, useCallback } from 'react';
import { Alert, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, Link, router } from 'expo-router';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { H1 } from '~/components/ui/typography';

import { supabase } from '@/lib/supabase';

import { useStartContext, type StartState } from '../context/StartContext';

export default function Signup() {
    const { session, email, mobile, setSession, setEmail, setMobile } = useStartContext() as StartState;
    const [password, setPassword] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
  
    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      })
  
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      })
    }, []);
  
    async function signUpWithEmail() {
      setLoading(true);
      const {
        data,
        error,
      } = await supabase.auth.signUp({
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
  
    return (
        <SafeAreaView>
          <Stack.Screen
              options={{
                  headerShown: false
              }}
          />
          <ScrollView
            contentContainerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'space-between', padding: 24 }} 
            keyboardShouldPersistTaps='handled'
          >
            <H1>Welcome!</H1>

            <View className='w-full flex flex-col gap-6'>
              <View>
                <Text>First Name</Text>
                <Input
                  onChangeText={(text) => setFirstName(text)}
                  value={firstName}
                  autoCapitalize='none'
                />
              </View>

              <View>
                <Text>Last Name</Text>
                <Input
                  onChangeText={(text) => setLastName(text)}
                  value={lastName}
                  autoCapitalize='none'
                />
              </View>

              <View>
                <Text>Email</Text>
                <Input
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  autoCapitalize='none'
                  keyboardType='email-address'
                />
              </View>

              <View>
                <Text>Mobile</Text>
                <Input
                  onChangeText={(text) => setMobile(text)}
                  value={mobile}
                  autoCapitalize={'none'}
                />
              </View>

              <View>
                <Text>Password</Text>
                <Input
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  secureTextEntry={true}
                  autoCapitalize='none'
                />
              </View>

            </View>

            <View className='w-full flex flex-row justify-between'>
              <Link replace href='/welcome/' asChild>
                <Button>
                  <Text>Back</Text>
                </Button>
              </Link>
              <TouchableOpacity
                  disabled={loading}
                  onPress={() => signUpWithEmail()}
              >
                  <Text>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
      </SafeAreaView>
    )
}