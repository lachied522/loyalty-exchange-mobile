import { useState, useEffect } from 'react';
import { Alert, StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { Stack, Link } from 'expo-router';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { H1 } from '~/components/ui/typography';

import { supabase } from '@/lib/supabase';

import type { Session } from '@supabase/supabase-js';

export default function Onboarding() {
    const [cardNumber, setCardNumber] = useState('');
    const [loading, setLoading] = useState(false);
  
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
              <View>
                <Text>Card</Text>
                <Input
                  onChangeText={(text) => setCardNumber(text)}
                  value={cardNumber}
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
                    onPress={() => {}}
                >
                    <Text>Next</Text>
                </Button>
            </View>
          </ScrollView>
      </SafeAreaView>
    )
}