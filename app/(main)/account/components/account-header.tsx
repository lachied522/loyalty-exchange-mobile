import { View } from "react-native"
import { Link } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "~/components/ui/button";
import { H3 } from "~/components/ui/typography";
import { ChevronLeft } from "~/components/Icons";
import { shadowStyles } from '~/constants/styling';


export default function AccountHeader() {
    // header component for account screen
    const insets = useSafeAreaInsets();

    return (
        <View className='min-h-[120px] flex flex-row items-center justify-between bg-white p-3 relative' style={{ paddingTop: insets.top, ...shadowStyles.edge }}>
            <View className='h-12 w-12 flex items-center justify-center rounded-[12] left-0'>
                <Link href='/(main)/' asChild>
                    <Button>
                        <ChevronLeft size={30} color='rgb(15 23 42)'/>
                    </Button>
                </Link>
            </View>

            <H3>
                Account
            </H3>

            <View className='h-12 w-12' />
        </View>
    )
}