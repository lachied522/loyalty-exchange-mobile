import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";

import { Text } from "~/components/ui/text";
import { H1, H3, Large, Small } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { cn } from "~/components/utils";

import { colors } from "~/constants/styling";

import { formatDate } from "~/app/utils/formatting";

import { useMainContext, type MainState } from "~/app/(main)/context/MainContext";
import { useRewardModal } from "~/app/(main)/context/RewardModalContext";
import TickingClock from "~/app/(main)/components/ticking-clock";
import RewardImage from "~/app/(main)/components/reward-image";

import RewardHeader from "./reward-header";

import type { Reward } from "~/app/types/helpers";

interface RewardScreenProps {
    rewardData: Reward
}

export default function RewardScreen({ rewardData }: RewardScreenProps) {
    const { userData, storeDataMap } = useMainContext() as MainState;
    const { isRewardLoading, onOpenReward } = useRewardModal();

    const userPoints = useMemo(() => {
        // get user points for this store
        return userData.points.find((obj) => obj.store_id === rewardData.store_id)?.balance || 0;
    }, [userData, rewardData]);

    return (
        <>
            <Stack.Screen
                options={{
                    header: () => <RewardHeader />,
                }}
            />
            <ScrollView
                contentContainerStyle={{ height: '100%', ...colors.background }}
                keyboardShouldPersistTaps='handled'
            >
                <View className='relative'>
                    <View className='z-[10] w-full h-full flex items-center justify-center bg-neutral-800/30 p-12 absolute' />
                    <RewardImage
                        url={rewardData.image_url}
                        height={240}
                        width='100%'
                        rounded={false}
                    />
                </View>
                
                <View className='items-center bg-white p-6 mb-3'>
                    <View className='flex flex-col items-center gap-1 px-6'>
                        <H3 className='max-w-[360px] text-center'>
                            {rewardData.title.slice(0, 60)} @
                        </H3>
                        <H3 className='max-w-[360px] text-center'>
                            {storeDataMap[rewardData.store_id]!.name}
                            {rewardData.conditions? '*': ''}
                        </H3>
                        {rewardData.conditions && (
                        <Small>*{rewardData.conditions}</Small>
                        )}
                    </View>
                </View>
                
                {rewardData.expires_at && (
                <View className='flex flex-row items-center justify-between bg-white p-6 mb-3'>
                    <View className='flex flex-row items-center justify-center gap-2'>
                        <TickingClock size={27} />
                        <Large>Available until</Large>
                    </View>

                    <Text>{formatDate(rewardData.expires_at, true)}</Text>
                </View>
                )}

                <View className='flex-1 flex-col justify-between bg-white p-6'>
                    <View className='flex flex-col gap-6'>
                        <View className='flex flex-row justify-between'>
                            <View className=''>
                                <H3>Your points</H3>
                                <Large className='font-display'>{userPoints.toLocaleString()}</Large>
                            </View>

                            <View className='items-end'>
                                <H3>Reward cost</H3>
                                <Large className='font-display'>{rewardData.cost.toLocaleString()} points</Large>
                            </View>
                        </View>

                        <View className='w-full p-1 border border-slate-100 rounded-full bg-neutral-100'>
                            <Progress value={100 * userPoints / rewardData.cost} className='w-full h-[32px]' />
                        </View>

                        <View className='w-full flex-row justify-end'>
                            <Large className='font-display'>{Math.max(rewardData.cost - userPoints, 0).toLocaleString()} points to go!</Large>
                        </View>
                    </View>

                    <View className='flex justify-end mb-6'>
                        {isRewardLoading? (
                        <Button disabled={true} className='min-h-[48px] bg-neutral-200'>
                            <Large className='text-black'>Pease wait...</Large>
                        </Button>
                        ) : (
                        <Button
                            disabled={userPoints < rewardData.cost || isRewardLoading}
                            onPress={() => onOpenReward(rewardData)}
                            className={cn(
                                'min-h-[48px] bg-yellow-400',
                                userPoints < rewardData.cost && 'bg-transparent border border-neutral-300'
                            )}
                        >
                            <Large className='text-black'>
                                Redeem
                            </Large>
                        </Button>
                        )}
                    </View>
                </View>
            </ScrollView>
        </>
    )
}