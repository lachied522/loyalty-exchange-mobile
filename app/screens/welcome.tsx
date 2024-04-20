import { View, SafeAreaView } from 'react-native';
import { Stack, Link } from 'expo-router';

import { Text } from '~/components/ui/text';
import { H1 } from '~/components/ui/typography';
import { Button } from '~/components/ui/button';

export default function Welcome() {
  
    return (
      <SafeAreaView style={{ flex: 1, marginTop: 40, padding: 24 }}>
        <Stack.Screen
            options={{
                headerShown: false
            }}
        />
        <View className='h-full flex flex-col items-center justify-between p-12'>
        <Text>Image Placeholder</Text>
        <H1>Hello</H1>

        <View className='w-full flex flex-row justify-between'>
            <Link href='/screens/login' asChild>
                <Button>
                    <Text>Login</Text>
                </Button>
            </Link>
            <Link href='/screens/signup' asChild>
                <Button>
                    <Text>Sign Up</Text>
                </Button>
            </Link>
            </View>
        </View>
      </SafeAreaView>
    )
}