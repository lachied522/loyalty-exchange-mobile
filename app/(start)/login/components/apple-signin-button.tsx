// https://supabase.com/docs/guides/auth/social-login/auth-apple?queryGroups=platform&platform=react-native
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Image } from 'expo-image';

import { supabase } from '~/app/lib/supabase';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { router } from 'expo-router';

async function signInWithApple() {
    const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
    });

    // Sign in via Supabase Auth.
    if (credential.identityToken) {
        const { data: { session }, error } = await supabase.auth.signInWithIdToken({
            provider: 'apple',
            token: credential.identityToken,
        });

        if (error) {
            throw error;
        }

        return session;
    } else {
        throw new Error('No identityToken.')
    }
}

interface AppleSigninButtonProps {
    handleError: (error: Error) => void
}

export default function AppleSigninButton({ handleError }: AppleSigninButtonProps) {
    const onPress = async () => {
        try {
            const session = await signInWithApple();
            if (!session) {
                throw new Error('Something went wrong.')
            }
            // if user is new, metadata will not contain 'role' field
            if (!(session.user.user_metadata['role'] || session.user.user_metadata['basiq_user_id'])) {                
                router.replace('/(start)/new-user-from-oauth/');
                return;
            }

            router.replace('/');
        } catch (error: any) {
            if (error.code === 'ERR_REQUEST_CANCELED') {
              // handle that the user canceled the sign-in flow
            } else {
                handleError(error);
            }
        }
    }

    if (Platform.OS !== 'ios') return null;
    return (
      <Button
        onPress={onPress}
        className='min-h-[48px] flex flex-row justify-center gap-3.5 border border-neutral-400'
      >
            <Image
                source={require('assets/auth/apple-logo.png')}
                alt='Provider Logo'
                style={{
                    width: 24,
                    height: 24,
                }}
                contentFit='cover'
            />
            <Text className='text-lg font-display-medium text-black'>
                Sign in with Apple
            </Text>
      </Button>
    )
}