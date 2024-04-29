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

import { BACKEND_URL, BASIQ_API_KEY } from '@env';

export default function Onboarding() {
    const { session, email, mobile } = useStartContext() as StartState;
    const [clientAccessToken, setClientAccessToken] = useState('');
    const [consentUrl, setConsentUrl] = useState<string | null>(); // url to consent UI
    const [isReady, setIsReady] = useState<boolean>(false); // true when consent UI is ready
    const [isComplete, setIsComplete] = useState<boolean>(false); // true when user has completed consent

    useEffect(() => {
        let isMounted = false; // prevent effect from executing twice

        if (session && !isMounted) {
          fetch(`${BACKEND_URL}/create-new-connection/${session.user.id}`, {
            method: 'GET',
            headers: {
              'token': session.access_token,
            }
          })
          .then((res) => res.json())
          .then(({ url }) => {
            setConsentUrl(url);
            setIsReady(true);
            console.log(url);
          })
          .catch((e) => console.log(e));

          isMounted = true;
        }

    //     getBasiqServerAccessToken().then((accessToken) => createUser(accessToken)).then((userID) => getClientTokenBoundToUser(userID)).then((token) => setClientAccessToken(token)).then(() => setIsReady(true));

    //     // create Basiq user
    //     async function createUser(accessToken: string) {
    //       return fetch('https://au-api.basiq.io/users', {
    //           method: 'POST',
    //           headers: {
    //               'Authorization': `Bearer ${accessToken}`,
    //               'Content-Type': 'application/json', 
    //               'Accept': 'application/json'
    //           },
    //           body: JSON.stringify({ email, mobile }),
    //       })
    //       .then((res) => res.json())
    //       .then((res) => res['id']);
    //     }

    //     // step 3: get unique client access token
    //     async function getClientTokenBoundToUser(userId: string) {
    //         return fetch('https://au-api.basiq.io/token', {
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': `Basic ${BASIQ_API_KEY}`, 
    //                 'Content-Type': 'application/x-www-form-urlencoded', 
    //                 'basiq-version': '3.0'
    //             },
    //             body: JSON.stringify({ scope: 'CLIENT_ACCESS', userId }),
    //         })
    //         .then((res) => res.json())
    //         .then((res) => res['access_token']);
    //       }
    }, []);

    const handleWebBrowser = useCallback(
      async () => {
          if (!consentUrl) return;

          // open browser
          await WebBrowser.openBrowserAsync(consentUrl);
      },
      [consentUrl]
    );
  
    return (
      <SafeAreaView style={{ flex: 1, marginTop: 40, padding: 24 }}>
        <Stack.Screen
              options={{
                  headerShown: false
              }}
          />
          <ScrollView 
            contentContainerStyle={{ height: '100%', justifyContent: 'center', padding: 24, gap: 24 }} 
            keyboardShouldPersistTaps='handled'
            scrollEnabled={false}
          >
            <View className='w-full flex flex-col gap-2'>
                <Large>Connect your credit/debit card to automatically start accruing points</Large>
                <Button
                  size='lg'
                  onPress={handleWebBrowser}
                  disabled={!isReady}
                >
                    <Text>Connect Card</Text>
                </Button>
            </View>
            <Link href='/home/' asChild>
              <View className='w-full items-center bg-yellow-400 p-2 rounded-xl'>
                  <Button disabled={!isComplete}>
                      <Text>Next</Text>
                  </Button>
                </View>
              </Link>
          </ScrollView>
      </SafeAreaView>
    )
}