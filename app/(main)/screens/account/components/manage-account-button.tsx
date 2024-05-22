import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useToast } from "react-native-toast-notifications";

import * as WebBrowser from 'expo-web-browser';

import { Large } from "~/components/ui/typography";
import { cn } from "~/components/utils";
import { Plus, Settings, Loader } from "~/components/Icons";

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

export default function ManageAccountButton({
    action,
    disabled, // let parent control whether button is disabled through this prop
    onStartNewRequest, // called when a new request for the consent UI is made
    onSuccess, // called when consent UI is succesfully opened in browser
    onError, // called on error
} : {
    action: 'manage'|'connect',
    disabled: boolean,
    onStartNewRequest: () => void,
    onSuccess: () => void,
    onError: () => void,
}) {
    const { getConsentURLFromSession, userMetadata } = useGlobalContext() as GlobalState;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const toast = useToast();

    const getConsentURLAndOpenBrowser = async () => {
        onStartNewRequest();

        const url = await getConsentURLFromSession(action);

        if (url) {
            await WebBrowser.openBrowserAsync(url)
            .then(() => onSuccess());
        } else {
            toast.show(
                'Something went wrong. Please try again later.',
                {
                    placement: 'top',
                    duration: 5000
                }
            );

            onError();
        }
    }

    const checkUserMetadata = () => {
        // Basiq requires a valid email and phone number
        // check that user has both
        if (!(userMetadata?.mobile && userMetadata?.email)) {
            toast.show(
                'Please ensure you have a valid email and mobile.',
                {
                    placement: 'top',
                    duration: 3000
                }
            )

            return false;
        }

        return true;
    }

    const onPress = async () => {
        const hasValidMetadata = checkUserMetadata();
        if (!hasValidMetadata) return;
        
        setIsLoading(true);
        await getConsentURLAndOpenBrowser()
        .then(() => setIsLoading(false));
    }

    // NOTE: onPress passed to 'Button' components do not update with state, must use TouchableOpacity
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            className={disabled? 'opacity-30': ''}
        >
            <View className={cn(
                'flex flex-row items-center gap-2 opacity-100',
                disabled && 'opacity-50'
            )}>
                {action==='connect' && (
                <>
                    <Plus size={20} color='black' />
                    <Large>Add new</Large>
                </>
                )}
                {action==='manage' && (
                    <>
                        <Settings size={18} color='black' />
                        <Large>Manage</Large>
                    </>
                )}
            </View>
        </TouchableOpacity>
    )
}