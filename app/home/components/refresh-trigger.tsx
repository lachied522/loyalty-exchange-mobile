import { useState, useCallback } from "react";
import { View } from "react-native";

import { Button } from "~/components/ui/button";
import { RefreshCw } from "~/components/Icons";
import { cn } from "~/lib/utils";

import { shadowStyles } from "~/lib/constants";

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

export default function RefreshTrigger() {
    const { refresh } = useGlobalContext() as GlobalState;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onPress = async () => {
        setIsLoading(true);
        await refresh().finally(() => setIsLoading(false));
    }

    return (
        <View className="w-16 h-16 flex items-center justify-center bg-white rounded-[18]" style={shadowStyles.button}>
            <Button 
                onPress={onPress}
                disabled={isLoading}
                className={cn('w-full h-full')}
            >
                <RefreshCw size={30} color='rgb(15 23 42)' />
            </Button>
        </View>
    )
}