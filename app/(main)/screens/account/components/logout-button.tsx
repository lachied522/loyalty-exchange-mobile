import { View } from "react-native";
import { router } from "expo-router";

import { Button } from "~/components/ui/button";
import { Large } from "~/components/ui/typography";
import { LogOut } from "~/components/Icons";

import { supabase } from "@/lib/supabase";

export default function LogoutButton() {

    const onLogout = () => {
        supabase.auth.signOut()
        .then(() => {
            router.replace('/login/');
        });
    }

    return (
        <View className='w-full flex items-center pb-12'>
            <Button onPress={onLogout}>
                <View className='flex flex-row items-center gap-2'>
                    <Large className=''>Log out</Large>
                    <LogOut size={24} color='black' />
                </View>
            </Button>
        </View>
    )
}