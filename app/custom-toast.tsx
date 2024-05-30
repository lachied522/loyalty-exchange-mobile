import { View } from "react-native";
import type { ToastProps } from "react-native-toast-notifications/lib/typescript/toast";

import { Text } from "~/components/ui/text";
import { Icon } from "~/components/Icons";
import { cn } from "~/components/utils";

export default function CustomToast(toast: ToastProps) {

    return (
        <View
            className={cn(
                'bg-white rounded-xl px-4 py-5 border-2',
                toast.type === 'success' && 'border-green-400',
                toast.type === 'warning' && 'border-amber-400',
                toast.type === 'danger' && 'border-red-400'
            )}
        >
            <View className='flex flex-row items-center gap-4'>
                {toast.type ==='normal' && <Icon name='Info' size={28} color='black' />}
                {toast.type ==='success' && <Icon name='CheckCheck' size={28} color='black' />}
                {toast.type ==='warning' && <Icon name='TriangleAlert' size={28} color='black' />}
                {toast.type ==='danger' && <Icon name='OctagonX' size={28} color='black' />}
                <Text className='max-w-[360px] text-lg font-display-medium'>
                    {toast.message}
                </Text>
            </View>
        </View>
    )
}