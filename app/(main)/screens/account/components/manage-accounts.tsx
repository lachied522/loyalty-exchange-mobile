import { useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import * as WebBrowser from 'expo-web-browser';

import { Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { Plus, Pencil } from "~/components/Icons";

import { useGlobalContext, type GlobalState } from "~/app/context/GlobalContext";

import { BACKEND_URL } from '@env';

export default function ManageAccounts({ action } : { action: 'manage'|'connect' }) {
    const { session } = useGlobalContext() as GlobalState;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onPress = async () => {
        if (!session) return;
        
        setIsLoading(true);
        
        const { url } = await fetch(`${BACKEND_URL}/manage-user-connections/${session.user.id}`, {
            method: 'GET',
            headers: {
                token: session.access_token,
                action,
            }
        })
        .then((res) => res.json());

        if (url) {
            await WebBrowser.openBrowserAsync(url);
        } else {
            // TO DO: handle error
        }

        setIsLoading(false);
    }

    return (
        <TouchableOpacity onPress={onPress} disabled={isLoading} className='items-center justify-center'>
            {isLoading? (
            <Text>Please wait...</Text>
            ) : (
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
            )}
        </TouchableOpacity>
    )
}