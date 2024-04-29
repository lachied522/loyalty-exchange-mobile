import { useState, useCallback } from "react";
import { View } from "react-native";

import { Button } from "~/components/ui/button";
import { RefreshCw, Check } from "~/components/Icons";
import { cn } from "~/components/utils";

import { shadowStyles } from "~/constants/constants";

import { useMainContext, type MainState } from "../../context/MainContext";

export default function RefreshTrigger() {
    const { refresh } = useMainContext() as MainState;
    const [isRefreshed, setIsRefreshed] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onPress = async () => {
        setIsLoading(true);

        await refresh()
        .then(() => setIsLoading(false))
        .then(() => {
            setIsRefreshed(true);
            // set cooldown of 30s
            setTimeout(() => {
                setIsRefreshed(false);
            }, 30000);
        })
        .catch(() => setIsLoading(false));
    }

    return (
        <View 
            className="w-16 h-16 flex items-center justify-center bg-white rounded-[18]"
            style={shadowStyles.button}
        >
            {isRefreshed ? (
            <Check size={32} color='rgb(187 247 208)' />
            ) : (
            <Button
                onPress={onPress}
                disabled={isLoading}
                className='w-full h-full'
            >
                <View className={cn('animate-none', !isRefreshed && isLoading && 'animate-spin')}>
                    {isRefreshed? (
                    <Check size={32} color='rgb(187 247 208)' />
                    ) : (
                    <RefreshCw size={36} color='rgb(15 23 42)' />
                    )}
                </View>
            </Button>
        )}
        </View>
    )
}