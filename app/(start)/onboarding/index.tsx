import { useState, useEffect, useCallback } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { Stack, Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Large } from '~/components/ui/typography';

import { getConsentURL } from '~/app/utils/connections';

import { useCustomToast } from '~/app/hooks/useCustomToast';

import { type GlobalState, useGlobalContext } from '~/app/context/GlobalContext';

export default function Onboarding() {
    const { session } = useGlobalContext() as GlobalState;
    const [consentUrl, setConsentUrl] = useState<string | null>(); // url to consent UI
    const [isReady, setIsReady] = useState<boolean>(false); // true when consent UI is ready
    const [isComplete, setIsComplete] = useState<boolean>(false); // true when user has completed consent
    const toast = useCustomToast();

    useEffect(() => {
        let isMounted = false; // prevent effect from executing twice

        if (session && !isMounted) {
          getConsentURL(session, 'connect')
          .then((url) => {
              if (url) {
                setConsentUrl(url);
                setIsReady(true);
              } else {
                toast.show("Something went wrong. Please click 'Next' and try again later.");
              }
              setIsComplete(true);
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
      [consentUrl, setIsComplete]
    );
  
    return (
      <>
        <Stack.Screen
              options={{
                  headerShown: false,
                  gestureEnabled: false
              }}
          />
        <SafeAreaView style={{ flex: 1, marginTop: 40, padding: 24 }}>
          <ScrollView
            contentContainerStyle={{ height: '100%', justifyContent: 'center', padding: 24, gap: 36 }} 
            keyboardShouldPersistTaps='handled'
            scrollEnabled={false}
          >
            <View className='flex flex-col items-start gap-2'>
              <Large>Connect your credit/debit cards to automatically start accruing points.</Large>
              <Text>Once you have connected your cards, click 'Next'.</Text>
            </View>
            
            <Button
              size='lg'
              onPress={handleWebBrowser}
              disabled={!isReady}
              className='min-h-[56px] flex items-center justify-center'
            >
              {!isReady? (
              <Text className='text-black'>Please wait...</Text>
              ) : (
              <Text className='text-black'>Connect Card</Text>
              )}
            </Button>

            <Link href='/(main)/' asChild>
              <Button disabled={!isComplete} className='w-full min-h-[56px] flex items-center justify-center bg-yellow-400'>
                  <Text className='text-black'>Next</Text>
              </Button>
            </Link>
          </ScrollView>
        </SafeAreaView>
      </>
    )
}