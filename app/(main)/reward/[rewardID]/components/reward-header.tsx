import { View } from "react-native"
import { router } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { H2, Small } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "~/components/Icons";
import { shadowStyles } from '~/constants/styling';

export default function RewardHeader() {
    // header component for store screen
    const insets = useSafeAreaInsets();

    const onBackNavigation = () => {
        if (router.canGoBack()) router.back();
        else router.replace('/(main)/');
    }

    return (
        <View className='h-[120px] flex flex-row items-center justify-between bg-white p-6' style={{ paddingTop: insets.top, ...shadowStyles.edge }}>
            <View className='h-12 w-12 flex items-center justify-center rounded-[12] left-0'>
                <Button onPress={onBackNavigation}>
                    <ChevronLeft size={30} color='rgb(15 23 42)'/>
                </Button>
            </View>

            {/* <View className='min-w-[80px] flex items-end justify-center'>
                <H2 className='font-semibold'>{Math.floor(Math.max(points, 0)).toLocaleString()}</H2>
                <Small>points</Small>
            </View> */}
        </View>
    )
}