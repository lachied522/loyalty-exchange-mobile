import { View } from "react-native";
import type { ToastProps } from "react-native-toast-notifications/lib/typescript/toast";

import { Text } from "~/components/ui/text";
import { cn } from "~/components/utils";

export default function CustomToast(toast: ToastProps) {

    return (
        <View className={cn(
            'bg-white rounded-xl',
            // TO DO
        )}>
          <Text className='max-w-[240px] text-lg font-display-medium'>{toast.message}</Text>
        </View>
    )
}