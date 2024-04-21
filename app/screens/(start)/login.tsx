import { useState, useEffect } from 'react';
import { Alert, View, SafeAreaView, ScrollView } from 'react-native';
import { Stack, Link, router } from 'expo-router';

import { supabase } from '@/lib/supabase';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { H1 } from '~/components/ui/typography';

import type { Session } from '@supabase/supabase-js';

export default function Login() {
    const [session, setSession] = useState<Session | null>(null);
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
  
    async function signInWithEmail() {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
  
      if (error) Alert.alert(error.message);
      setLoading(false);
    }
  
    async function signUpWithEmail() {
      setLoading(true)
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
  
      if (error) {
        Alert.alert(error.message);
        setLoading(false);
        return
      };
      
      // navigate to home page
      router.replace('/');
    }
  
    return (
      <SafeAreaView style={{ flex: 1, marginTop: 40, padding: 24 }}>
          <Stack.Screen
              options={{
                  headerShown: false
              }}
          />
          <ScrollView 
            contentContainerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'space-between', padding: 24 }} 
            keyboardShouldPersistTaps='handled'
          >
            <H1>Welcome Back</H1>

            <View className='w-full flex flex-col gap-2'>
              <View>
                <Text>Email</Text>
                <Input
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  placeholder="email@address.com"
                  autoCapitalize={'none'}
                />
              </View>

              <View>
                <Text>Password</Text>
                <Input
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  secureTextEntry={true}
                  placeholder="Password"
                  autoCapitalize={'none'}
                />
              </View>

            </View>

            <View className='w-full flex flex-row justify-between'>
              <Link href='/screens/welcome' asChild>
                <Button>
                  <Text>Back</Text>
                </Button>
              </Link>
              <Button
                  disabled={loading} 
                  onPress={() => signInWithEmail()}
              >
                  <Text>Login</Text>
              </Button>
            </View>
          </ScrollView>
      </SafeAreaView>
    )
}