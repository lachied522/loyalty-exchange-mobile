import { useState, useEffect } from 'react';
import { Alert, View, SafeAreaView, ScrollView } from 'react-native';
import { Stack, Link, router } from 'expo-router';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { H1 } from '~/components/ui/typography';

import { supabase } from '@/lib/supabase';

import type { Session } from '@supabase/supabase-js';

export default function Signup() {
    const [session, setSession] = useState<Session | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })
  
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
    }, []);
  
    async function signUpWithEmail() {
      setLoading(true);
      // const {
      //   data: { session },
      //   error,
      // } = await supabase.auth.signUp({
      //   email: email,
      //   password: password,
      // });
  
      // if (error) Alert.alert(error.message);
      // navigate to onboarding page
      router.replace('/screens/onboarding');
    }
  
    return (
      <SafeAreaView style={{ flex: 1, marginTop: 40, padding: 24 }}>
        <Stack.Screen
              options={{
                  headerShown: false
              }}
          />
          <ScrollView 
            contentContainerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'space-between', padding: 12 }} 
            keyboardShouldPersistTaps='handled'
          >
            <Text>Image Placeholder</Text>
            <H1>Welcome!</H1>

            <View className='w-full flex flex-col gap-2'>
              <View>
                <Text>Name</Text>
                <Input
                  onChangeText={(text) => setName(text)}
                  value={name}
                  autoCapitalize={'none'}
                />
              </View>


              <View>
                <Text>Email</Text>
                <Input
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  autoCapitalize={'none'}
                />
              </View>

              <View>
                <Text>Password</Text>
                <Input
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  secureTextEntry={true}
                  autoCapitalize={'none'}
                />
              </View>

            </View>


            <View className='w-full flex flex-row justify-between'>
              <Link replace href='/screens/welcome' asChild>
                <Button>
                  <Text>Back</Text>
                </Button>
              </Link>
                <Button
                    disabled={loading} 
                    onPress={() => signUpWithEmail()}
                >
                    <Text>Sign Up</Text>
                </Button>
            </View>
          </ScrollView>
      </SafeAreaView>
    )
}