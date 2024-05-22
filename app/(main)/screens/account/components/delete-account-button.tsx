import { useState } from "react";
import { Alert, View } from "react-native";
import { router } from "expo-router";

import { useToast } from "react-native-toast-notifications";

import { Button } from "~/components/ui/button";
import { Large } from "~/components/ui/typography";

import { deleteUserAccount } from "@/utils/functions";

export default function DeleteAccountButton() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useToast();

    const onDelete = async () => {
        setIsLoading(true);
        
        try {
            await deleteUserAccount();
            // navigate to login
            router.replace('/login/');
        } catch (e) {
            toast.show(
                'Something went wrong. Please try again later or contact us.',
                {
                    placement: 'top',
                    duration: 5000
                }
            );
        }

        setIsLoading(false);
    }

    const onPress = () => {
        Alert.alert(
            'Are you sure you want to delete your account?',
            'This will delete all of your data, including your transactions. This cannot be undone.',
            [
                {
                    text: 'Cancel'
                },
                {
                    text: 'OK',
                    onPress: () => {
                        onDelete();
                    },
                }
            ]
        )
    }

    return (
        <Button onPress={onPress} disabled={isLoading}>
            <View className='min-h-[48px] flex flex-row items-center gap-2 p-2'>
                {isLoading? (
                <Large>Please wait...</Large>
                ) : (
                <Large>Delete My Account</Large>
                )}
            </View>
        </Button>
    )
}