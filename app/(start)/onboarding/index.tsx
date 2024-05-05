import { useState, useEffect, useCallback } from 'react';
import { Alert, StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { Stack, Link } from 'expo-router';

import * as WebBrowser from 'expo-web-browser';

import { useToast } from "react-native-toast-notifications";

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { H1, Large, P } from '~/components/ui/typography';

import { useStartContext, type StartState } from '../context/StartContext';

import { BACKEND_URL } from '@env';

export default function Onboarding() {
    const { session } = useStartContext() as StartState;
    const [consentUrl, setConsentUrl] = useState<string | null>(); // url to consent UI
    const [isReady, setIsReady] = useState<boolean>(false); // true when consent UI is ready
    const [isComplete, setIsComplete] = useState<boolean>(false); // true when user has completed consent
    const toast = useToast();

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
          })
          .catch((e) => {
            toast.show("Something went wrong. Please try again later.");
          });

          isMounted = true;
        }
    }, [session]);

    const handleWebBrowser = useCallback(
      async () => {
          if (!consentUrl) return;

          // open browser
          await WebBrowser.openBrowserAsync(consentUrl);
          setIsComplete(true);
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
            <Large>Connect your credit/debit card to automatically start accruing points</Large>
            
            <Button
              size='lg'
              onPress={handleWebBrowser}
              disabled={!isReady}
            >
              {!isReady? (
              <Text>Please wait...</Text>
              ) : (
              <Text>Connect Card</Text>
              )}
            </Button>
            <Link href='/(main)/' asChild>
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