import { useMemo } from "react";
import { View } from "react-native";

import { Card, CardContent } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";

import { useMainContext, type MainState } from "~/app/(main)/context/MainContext";
import RewardTrigger from "~/app/(main)/components/reward-trigger";

interface RewardProgressProps {
    storeID: string
}

export default function AvailableRewards({ storeID }: RewardProgressProps) {
    const { userData, storeData } = useMainContext() as MainState;

    const userPoints = useMemo(() => {
        return  userData.points.find((obj) => obj.store_id===storeID)?.balance || 0;
    }, [userData, storeID]);

    if (!(storeID in storeData)) return null;

    return (
        <>
        {storeData[storeID].reward_types.length > 0? (
        <View>
            {storeData[storeID].reward_types.map((reward) => (
                <Card key={reward.id}>
                    <CardContent className='flex items-center justify-center p-6'>
                        <View className='w-full flex flex-row items-center justify-between'>
                            <View className='flex flex-col gap-1'>
                                <Large>{reward.title}</Large>
                                <Text>{reward.cost.toLocaleString()} points</Text>
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
            <View className='w-full flex items-center'>
                <Text>This store doesn't have any rewards available yet.</Text>
            </View>
        )}
        </>
    )
}