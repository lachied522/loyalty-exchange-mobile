import { View } from "react-native";
import { useToast } from "react-native-toast-notifications";

import * as WebBrowser from 'expo-web-browser';

import { Button } from "~/components/ui/button";
import { Large } from "~/components/ui/typography";
import { Plus, Pencil } from "~/components/Icons";

import type { Session } from "@supabase/supabase-js";

import { getConsentURL } from "@/utils/connections";

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

export default function ManageAccounts({
    action,
    isLoading,
    setIsLoading,
} : {
    action: 'manage'|'connect',
    isLoading: boolean,
    setIsLoading : React.Dispatch<boolean>,
}) {
    const { session } = useGlobalContext() as GlobalState;
    const toast = useToast();

    const onPress = async () => {
        if (!session) return;

        const hasValidMetadata = checkUserMetadata(session);

        if (!hasValidMetadata) return;
        
        setIsLoading(true);
        
        const url = await getConsentURL(session, action);

        if (url) {
            await WebBrowser.openBrowserAsync(url);
        } else {
            toast.show(
                'Something went wrong. Please try again later.',
                {
                    placement: 'top',
                    duration: 5000
                }
            )
        }

        setIsLoading(false);
    }

    const checkUserMetadata = (session: Session) => {
        // Basiq requires a valid email and phone number
        // check that user has both
        if (!(session.user.phone && session.user.email)) {
            toast.show(
                'Please ensure you have a valid email and mobile.',
                {
                    placement: 'top',
                    duration: 5000
                }
            )

            return false;
        }

        return true;
    }

    return (
        <Button onPress={onPress} disabled={isLoading} className='items-center justify-center'>
            <View className='flex flex-row items-center gap-2'>
                {action==='connect' && (
                    <>
                        <Plus size={20} color='black' />
                        <Large>Add new</Large>
                    </>
                )}
                {action==='manage' && (
                    <>
                        <Pencil size={18} color='black' />
                        <Large>Edit</Large>
                    </>
                )}
            </View>
        </Button>
    )
}