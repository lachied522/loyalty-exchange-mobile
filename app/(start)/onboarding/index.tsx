import { useState, useEffect, useCallback } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { Stack, Link } from 'expo-router';

import * as WebBrowser from 'expo-web-browser';

import { useToast } from "react-native-toast-notifications";

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Large } from '~/components/ui/typography';

import { createNewConnection } from '@/utils/connections';

import { useStartContext, type StartState } from '../context/StartContext';

export default function Onboarding() {
    const { session } = useStartContext() as StartState;
    const [consentUrl, setConsentUrl] = useState<string | null>(); // url to consent UI
    const [isReady, setIsReady] = useState<boolean>(false); // true when consent UI is ready
    const [isComplete, setIsComplete] = useState<boolean>(false); // true when user has completed consent
    const toast = useToast();

    useEffect(() => {
        let isMounted = false; // prevent effect from executing twice

        if (session && !isMounted) {
          createNewConnection(session)
          .then((url) => {
              if (url) {
                setConsentUrl(url);
                setIsReady(true);
              } else {
                toast.show(
                  "Something went wrong. Please try again later.",
                  {
                    placement: 'top',
                    duration: 5000
                  }
                );
              }
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
      <>
        <Stack.Screen
              options={{
                  headerShown: false
              }}
          />
        <SafeAreaView style={{ flex: 1, marginTop: 40, padding: 24 }}>
          <ScrollView
            contentContainerStyle={{ height: '100%', justifyContent: 'center', padding: 24, gap: 36 }} 
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
              <Text className='text-black'>Please wait...</Text>
              ) : (
              <Text className='text-black'>Connect Card</Text>
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
      </>
    )
}