import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Large } from "~/components/ui/typography";
import { shadowStyles } from '~/constants/styling';
import { UserRound } from "~/components/Icons";

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";


export default function AccountHeader() {
    // header component for account screen
    const { session } = useGlobalContext() as GlobalState;
    const insets = useSafeAreaInsets();

    return (
        <View className='h-[120px] flex flex-row items-center justify-between bg-white p-3' style={{ paddingTop: insets.top, ...shadowStyles.edge }}>
            <View className='flex flex-row items-center gap-2'>
                <UserRound size={24} color='black' />

                <Large>{session!.user.user_metadata['first_name']+ ' ' + session!.user.user_metadata['last_name'] || 'Username'}</Large>
            </View>
        </View>
    )
}