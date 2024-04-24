import { useState, useCallback } from "react";
import { View } from "react-native";

import { RefreshCw } from "lucide-react-native";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import { refresh } from "@/utils/functions";

export default function RefreshTrigger() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onPress = async () => {
        setIsLoading(true);
        await refresh().finally(() => setIsLoading(false));
    }

    return (
        <View className="w-16 h-16 flex items-center justify-center bg-slate-100 rounded-[18] shadow-sm">
            <Button 
                onPress={onPress}
                disabled={isLoading}
                className={cn('w-full h-full')}
            >
                <RefreshCw size={36} color='black' />
            </Button>
        </View>
    )
}