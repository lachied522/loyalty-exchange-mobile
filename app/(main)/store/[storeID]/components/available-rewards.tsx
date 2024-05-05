import { useMemo } from "react";
import { View } from "react-native";

import { Card, CardContent } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { Icon } from "~/components/Icons";

import { useMainContext, type MainState } from "~/app/(main)/context/MainContext";
import RewardTrigger from "~/app/(main)/components/reward-trigger";

import type { StoreData } from "@/types/helpers";

interface RewardProgressProps {
    storeData: StoreData
}

export default function AvailableRewards({ storeData }: RewardProgressProps) {
    const { userData } = useMainContext() as MainState;

    const userPoints = useMemo(() => {
        return  userData.points.find((obj) => obj.store_id===storeData.id)?.balance || 0;
    }, [userData, storeData]);

    return (
        <View className='w-full flex flex-col bg-white gap-4 p-3 pt-6'>
            <Large>Available Rewards</Large>
            {storeData.reward_types.length > 0? (
            <View className='p-3'>
                {storeData.reward_types.map((reward) => (
                    <Card key={reward.id}>
                        <CardContent className='flex items-center justify-center p-6'>
                            <View className='w-full flex flex-row items-center justify-between'>
                                <View className='flex flex-row items-center gap-2'>
                                    <Icon name={reward.icon_name || 'Coffee'} size={32} />
                                    <View className='flex flex-col gap-1'>
                                        <Large>{reward.title}</Large>
                                        <Text>{reward.cost.toLocaleString()} points</Text>
                                    </View>
                                </View>

                                {userPoints > reward.cost? (
                                <RewardTrigger rewardData={reward} />
                                ) : (
                                <View className='flex flex-col items-end gap-2'>
                                    <Progress value={100 * (Math.max(userPoints - reward.cost, 0)) / reward.cost} className='w-[160px] border border-slate-100' />

                                    <Text>{Math.max(reward.cost - userPoints, 0)} points to go!</Text>
                                </View>
                                )}
                            </View>
                        </CardContent>
                    </Card>
                ))}
            </View>
            ) : (
            <View className='w-full flex items-center p-12'>
                <Text>This store doesn't have any rewards available yet.</Text>
            </View>
            )}
        </View>
    )
}