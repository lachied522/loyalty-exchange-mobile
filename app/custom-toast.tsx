import { View } from "react-native";
import type { ToastProps } from "react-native-toast-notifications/lib/typescript/toast";

import { Text } from "~/components/ui/text";
import { cn } from "~/components/utils";

import { shadowStyles } from "~/constants/styling";

export default function CustomToast(toast: ToastProps) {

    return (
        <View
            className={cn(
                'bg-white rounded-xl',
                // TO DO
            )}
            style={shadowStyles.edge}
        >
          <Text className='max-w-[240px] text-lg font-display-medium px-3 py-2'>
                {toast.message}
            </Text>
        </View>
    )
}