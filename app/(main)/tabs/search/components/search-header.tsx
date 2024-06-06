import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { shadowStyles } from '~/constants/styling';
import { H3 } from "~/components/ui/typography";

export default function SearchHeader() {
    // header component for account screen
    const insets = useSafeAreaInsets();

    return (
        <View className='min-h-[120px] flex flex-row items-center justify-center bg-white p-3 relative' style={{ paddingTop: insets.top, ...shadowStyles.edge }}>
            <H3>
                Search Stores
            </H3>
        </View>
    )
}