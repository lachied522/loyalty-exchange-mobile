import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";

import { Text } from "~/components/ui/text";
import { H1, H3, Large } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";

import { colors } from "~/constants/styling";

import { useMainContext, type MainState } from "~/app/(main)/context/MainContext";
import { useRewardModal } from "~/app/(main)/context/RewardModalContext";
import RewardImage from "~/app/(main)/components/reward-image";

import RewardHeader from "./reward-header";

import type { Reward } from "~/app/types/helpers";

interface RewardScreenProps {
    rewardData: Reward
}

export default function RewardScreen({ rewardData }: RewardScreenProps) {
    const { userData } = useMainContext() as MainState;
    const { isRewardOpen, onOpenReward } = useRewardModal();

    const userPoints = useMemo(() => {
        // get user points for this store
        return userData.points.find((obj) => obj.store_id === rewardData.store_id)?.balance || 0;
    }, [userData, rewardData]);

    return (
        <>
            <Stack.Screen
                options={{
                    header: () => <RewardHeader />
                }}
            />
            <ScrollView
                contentContainerStyle={{ ...colors.background }}
                keyboardShouldPersistTaps='handled'
            >
                <View className='relative'>
                    <View className='z-[10] w-full h-full flex items-center justify-center bg-neutral-800/30 p-12 absolute'>
                        <H1 className='text-center text-white'>
                            {rewardData.title}
                        </H1>
                    </View>

                    <RewardImage
                        url={rewardData.image_url}
                        height={240}
                        width='100%'
                        rounded={false}
                    />
                </View>
                
                <View className='flex items-center p-6 bg-white mb-3'>
                    <View className='w-full flex flex-col items-center justify-center p-3 gap-2'>

                        <View className='h-[1px] w-full my-3 bg-neutral-200' />
                        
                        {/* <View className='flex flex-row items-center gap-5'>
                            <MapPin size={30} color='black' />

                            <Large className='max-w-[300px] text-right font-display'>
                                {formatAddress(storeData)}
                            </Large>
                        </View> */}
                    </View>
                </View>

                <View className='w-full bg-white p-6'>
                    <Button
                        onPress={() => onOpenReward(rewardData)}
                        className='min-h-[48px] bg-yellow-400'
                    >
                        <Large className='text-black'>Redeem</Large>
                    </Button>
                </View>
            </ScrollView>
        </>
    )
}