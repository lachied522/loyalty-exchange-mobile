import { View } from "react-native";
import { router } from "expo-router";

import { Button } from "~/components/ui/button";
import { Large } from "~/components/ui/typography";
import { LogOut } from "~/components/Icons";

import { supabase } from "@/lib/supabase";

export default function LogoutButton() {

    const onLogout = () => {
        supabase.auth.signOut()
        .catch((e) => {
            console.log(e);
            // this errors when user is undefined, in which case it is safe to navigate to login page
            router.replace('/login/');
        });

        router.replace('/login/');
    }

    return (
        <Button onPress={onLogout}>
            <View className='min-h-[48px] flex flex-row items-center justify-center gap-2 p-2'>
                <Large className='text-black'>Log Out</Large>
                <LogOut size={18} color='black' />
            </View>
        </Button>
    )
}