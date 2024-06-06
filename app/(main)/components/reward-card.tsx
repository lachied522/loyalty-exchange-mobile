import { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { Link, router } from "expo-router";

import { Text } from '~/components/ui/text';
import { Large, Small } from "~/components/ui/typography";
import { Button } from '~/components/ui/button';
import { Icon } from "~/components/Icons";
import { cn } from "~/components/utils";

import { formatTimeRemaining } from "~/app/utils/formatting";

import { type MainState, useMainContext } from "~/app/(main)/context/MainContext";
import { useRewardModal } from "~/app/(main)/context/RewardModalContext";
import RewardImage from "~/app/(main)/components/reward-image";
import TickingClock from "~/app/(main)/components/ticking-clock";

import type { Reward } from "~/app/types/helpers";

interface RewardCardProps {
    rewardData: Reward,
}

export default function RewardCard({ rewardData }: RewardCardProps) {
    const { userData, storeDataMap, setMyRewardsIsOpen } = useMainContext() as MainState;
    const { isRewardLoading, onOpenReward } = useRewardModal();

    const userPoints = useMemo(() => {
        // number of points user has at this store
        return userData.points.find((obj) => obj.store_id===rewardData.store_id)?.balance || 0;
    }, [userData.points]);

    return (
        <View className='min-h-[365px] flex flex-col justify-end gap-2'>
            {rewardData.expires_at && (
            <View className='flex flex-row items-center justify-center gap-2'>
                <TickingClock size={27} />
                <Large>{formatTimeRemaining(rewardData.expires_at)} left</Large>
            </View>
            )}
            
            <TouchableOpacity
                onPress={() => {
                        router.push({
                            pathname: '/(main)/reward/[rewardID]',
                            params: { rewardID: rewardData.id }
                        });
                        // close MyRewards modal if it is open
                        setMyRewardsIsOpen(false);
                    }
                }
                activeOpacity={0.5}
            >
                <View className='w-[240px] flex flex-col items-center bg-neutral-100 rounded-xl'>
                    <RewardImage
                        url={rewardData.image_url || storeDataMap[rewardData.store_id]?.store_img_url}
                        width='100%'
                        height={160}
                    />

                    <View className='w-full flex flex-col items-start py-5 gap-2 px-5'>
                        <View className='w-full min-h-[56px] flex flex-row items-center justify-start gap-3.5'>
                            <Icon name={rewardData.icon_name || 'PartyPopper'} size={32} color='black' />

                            <Large className='max-w-[160px] max-h-[56px]'>
                                {rewardData.title}
                                {rewardData.conditions? '*': ''}
                            </Large>
                        </View>

                        <Small className='min-h-[24px]'>
                            {rewardData.conditions? '*' + rewardData.conditions: ''}
                        </Small>

                        {isRewardLoading? (
                        <Button disabled={true} className='bg-neutral-200'>
                            <Text className='text-black'>Pease wait...</Text>
                        </Button>
                        ) : (
                        <Button
                            disabled={userPoints < rewardData.cost || isRewardLoading}
                            onPress={() => onOpenReward(rewardData)}
                            className={cn(
                                'bg-yellow-400',
                                userPoints < rewardData.cost && 'bg-transparent border border-neutral-300'
                            )}
                        >
                            <Text className='text-black'>
                                {rewardData.cost.toLocaleString()} points
                            </Text>
                        </Button>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}