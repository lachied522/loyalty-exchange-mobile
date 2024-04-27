import { View } from "react-native";

import { Card, CardContent } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";

import type { StoreData, UserData } from "@/utils/crud";


interface RewardProgressProps {
    storeData: StoreData
    userPoints: number
}

export default function RewardProgress({ storeData, userPoints }: RewardProgressProps) {

    return (
        <>
        {storeData.reward_types.length > 0? (
        <View>
            {storeData.reward_types.map((reward) => (
                <Card key={reward.id}>
                    <CardContent className='flex items-center justify-center p-6'>
                        <View className='w-full flex flex-row items-start justify-between'>
                            <Large>{reward.title}</Large>

                            <View className='flex flex-col items-end gap-2'>
                                <Progress value={100 * (Math.max(userPoints - reward.cost, 0)) / reward.cost} className='w-[160px] border border-slate-100' />

                                <Text>{Math.max(reward.cost - userPoints, 0)} points to go!</Text>
                            </View>
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