import { useState, useEffect, useCallback } from 'react';
import { Alert, StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { Stack, Link } from 'expo-router';

import * as WebBrowser from 'expo-web-browser';

import { getBasiqServerAccessToken } from '@/lib/basiq';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { H1, Large, P } from '~/components/ui/typography';

import { useStartContext, type StartState } from '../context/StartContext';

import { BASIQ_API_KEY } from '@env';

export default function Onboarding() {
    const { email, mobile } = useStartContext() as StartState;
    const [clientAccessToken, setClientAccessToken] = useState('');
    const [ready, setReady] = useState(false); // true when user has been created in Basiq api and consent UI can be opened

    useEffect(() => {
        let isMounted = false; // prevent effect from executing twice

        getBasiqServerAccessToken().then((accessToken) => createUser(accessToken)).then((userID) => getClientTokenBoundToUser(userID)).then((token) => setClientAccessToken(token)).then(() => setReady(true));

        // create Basiq user
        async function createUser(accessToken: string) {
          return fetch('https://au-api.basiq.io/users', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json', 
                  'Accept': 'application/json'
              },
              body: JSON.stringify({ email, mobile }),
          })
          .then((res) => res.json())
          .then((res) => res['id']);
        }

        // step 3: get unique client access token
        async function getClientTokenBoundToUser(userId: string) {
            return fetch('https://au-api.basiq.io/token', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${BASIQ_API_KEY}`, 
                    'Content-Type': 'application/x-www-form-urlencoded', 
                    'basiq-version': '3.0'
                },
                body: JSON.stringify({ scope: 'CLIENT_ACCESS', userId }),
            })
            .then((res) => res.json())
            .then((res) => res['access_token']);
          }
    }, []);

    const handleWebBrowser = useCallback(async () => {
        if (!clientAccessToken) return;

        console.log(`https://consent.basiq.io/home?token=${clientAccessToken}`);
        // open browser
        await WebBrowser.openBrowserAsync(`https://consent.basiq.io/home?token=${clientAccessToken}&action=connect`);
    }, [clientAccessToken]);
  
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
            <View className='w-full flex flex-col gap-2'>
                <Large>Connect your credit/debit card to automatically start accruing points</Large>
                <Button 
                  size='lg'
                  onPress={handleWebBrowser}
                  disabled={!ready}
                >
                    <Text>Connect Card</Text>
                </Button>
            </View>

            <View className='w-full flex flex-row justify-end'>
              <Link href='/home/' asChild>
                <Button disabled={!clientAccessToken}>
                    <Text>Next</Text>
                </Button>
              </Link>
            </View>
          </ScrollView>
      </SafeAreaView>
    )
}