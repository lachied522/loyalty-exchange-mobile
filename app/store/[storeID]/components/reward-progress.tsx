import { View } from "react-native";

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
        <View>
            {storeData.reward_types.map((reward) => (
                <View className='w-full flex flex-row items-start justify-between'>
                    <Large>{reward.title}</Large>

                    <View className='flex flex-col items-end gap-2'>
                        <Progress value={100 * (Math.max(reward.cost - userPoints, 0)) / reward.cost} className='w-[160px] bg-yellow-400 border border-slate-100' />

                        <Text>{Math.max(reward.cost - userPoints, 0)} points to go!</Text>
                    </View>
                </View>
            ))}
        </View>
    )
}