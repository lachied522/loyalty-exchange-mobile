// docs: https://supabase.com/docs/guides/auth/social-login/auth-facebook?queryGroups=language&language=js
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

import { supabase } from '~/app/lib/supabase';

import { type GlobalState, useGlobalContext } from '~/app/context/GlobalContext';

import { processOAuthUserMetadata } from '../../functions/oauth-helpers';

const PROVIDER_MAP = {
    facebook: {
        logo: require('assets/auth/facebook-logo.png'),
        name: 'Facebook'
    },
    google: {
        logo: require('assets/auth/google-logo.png'),
        name: 'Google'
    }
}

const redirectTo = makeRedirectUri();

async function createSessionFromUrl(url: string) {
    const { params, errorCode } = QueryParams.getQueryParams(url);
  
    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token } = params;
  
    if (!access_token) return;
  
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) throw error;

    return data.session;
};

async function performOAuth(provider: 'facebook'|'google') {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo,
            skipBrowserRedirect: true,
        }
    });

    if (error) throw error;
    
    const res = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
    );

    if (res.type === "success") {
        const { url } = res;
        return await createSessionFromUrl(url);
    }
}

interface OAuthSigninButtonProps {
    provider: 'facebook'|'google',
    handleError: (error: Error) => void
}

export default function OAuthSigninButton({ provider, handleError }: OAuthSigninButtonProps) {
    const { setUserMetadata } = useGlobalContext() as GlobalState;

    const url = Linking.useURL();
    if (url) createSessionFromUrl(url);

    const onPress = async () => {
        try {
            const session = await performOAuth(provider);
            if (!session) {
                throw new Error('Something went wrong.')
            }
            // if user is new, metadata will not contain 'role' field
            // TO DO: add a better way of handling first time logins
            if (!(session.user.user_metadata['role'] || session.user.user_metadata['basiq_user_id'])) {
                const _metadata = processOAuthUserMetadata(session);                
                
                setUserMetadata(_metadata);
                router.replace('/(start)/new-user-from-oauth/');
                return;
            }

            router.replace('/');
        } catch (error: any) {
            handleError(error);
        }
    }
  
    return (
        <Button
            onPress={onPress}
            className='min-h-[48px] flex flex-row justify-center gap-3.5 border border-neutral-400'
        >
            <Image
                source={PROVIDER_MAP[provider].logo}
                alt='Provider Logo'
                style={{
                    width: 24,
                    height: 24,
                }}
                contentFit='cover'
            />
            <Text className='text-lg font-display-medium text-black'>
                Sign in with {PROVIDER_MAP[provider].name}
            </Text>
        </Button>
    )
}