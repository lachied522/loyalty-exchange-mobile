import { useState, useEffect } from 'react';
import { Alert, StyleSheet, View, SafeAreaView } from 'react-native';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';

import { supabase } from '../utils/supabase';

import type { Session } from '@supabase/supabase-js';

export default function Login() {
    const [session, setSession] = useState<Session | null>(null);
  
    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })
  
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
    }, []);
  
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
  
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
      })
  
      if (error) Alert.alert(error.message);
      setLoading(false);
    }
  
    return (
      <SafeAreaView style={{ flex: 1, marginTop: 40, padding: 24 }}>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Input
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="email@address.com"
              autoCapitalize={'none'}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <Input
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              placeholder="Password"
              autoCapitalize={'none'}
            />
          </View>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Button disabled={loading} onPress={() => signInWithEmail()}>
                <Text>Sign In</Text>
            </Button>
          </View>
          <View style={styles.verticallySpaced}>
            <Button disabled={loading} onPress={() => signUpWithEmail()}>
                <Text>Sign Up</Text>
            </Button>
          </View>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      marginTop: 40,
      padding: 12,
    },
    verticallySpaced: {
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
    },
    mt20: {
      marginTop: 20,
    },
});