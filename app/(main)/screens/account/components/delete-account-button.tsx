import { Alert, View } from "react-native";
import { router } from "expo-router";

import { Button } from "~/components/ui/button";
import { Large } from "~/components/ui/typography";

import { deleteUserAccount } from "@/utils/functions";

export default function DeleteAccountButton() {

    const onDelete = async () => {
        await deleteUserAccount();
        // navigate to login
        router.replace('/login/');
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
        <Button onPress={onPress} className='min-h-[48px] p-4'>
            <View className='flex flex-row items-center gap-2'>
                <Large className=''>Delete My Account</Large>
            </View>
        </Button>
    )
}