import { View } from "react-native"
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Large, Small } from "~/components/ui/typography";
import { shadowStyles } from '~/constants/styling';

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

export default function HomeHeader() {
    // header component for account screen
    const { userMetadata } = useGlobalContext() as GlobalState;
    const insets = useSafeAreaInsets();

    return (
        <View className='min-h-[120px] flex flex-row items-center justify-between bg-white p-3' style={{ paddingTop: insets.top, ...shadowStyles.edge }}>
            <View className='flex flex-row items-center justify-center gap-2'>
                <Image
                    source={require('assets/images/logo.png')}
                    alt='Loyalty Exchange logo'
                    style={{
                        width: 50,
                        height: 50
                    }}
                    contentFit="cover"
                />

                <View className='flex flex-col items-start justify-start gap-1'>
                    <Small>Welcome</Small>
                    <Large>{userMetadata?.first_name || ''}</Large>
                </View>
            </View>
        </View>
    )
}