import { View } from "react-native";
import { useToast } from "react-native-toast-notifications";

import * as WebBrowser from 'expo-web-browser';

import { Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { Plus, Pencil } from "~/components/Icons";

import { useGlobalContext, type GlobalState } from "~/app/context/GlobalContext";

import { Button } from "~/components/ui/button";

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
        
        setIsLoading(true);
        
        const { url } = await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/manage-user-connections/${session.user.id}`,
            {
                method: 'GET',
                headers: {
                    token: session.access_token,
                    action,
                }
            }
        )
        .then((res) => res.json());

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