import { useState, useEffect } from 'react';
import { Alert, View, SafeAreaView, ScrollView } from 'react-native';
import { Stack, Link, router } from 'expo-router';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { H1 } from '~/components/ui/typography';

import { supabase } from '@/lib/supabase';

import { useStartContext, type StartState } from './context/StartContext';

export default function Signup() {
    const { session, username, email, mobile, setSession, setUsername, setEmail, setMobile } = useStartContext() as StartState;
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
  
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
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
  
      if (error) {
        Alert.alert(error.message);
        setLoading(false);
        return;
      };
      
      // navigate to onboarding page
      router.replace('/screens/onboarding');
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
                <Text>Username</Text>
                <Input
                  onChangeText={(text) => setUsername(text)}
                  value={username}
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