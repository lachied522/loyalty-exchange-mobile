import { View } from "react-native";

import { Button } from "~/components/ui/button";
import { Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { Icon } from "~/components/Icons";

import RewardTrigger from "~/app/(main)/components/reward-trigger";
import RewardImage from "~/app/(main)/components/reward-image";

import type { Reward } from "@/types/helpers";

interface RewardCardProps {
    data: Reward,
    userPoints: number
}

export default function RewardCard({ data, userPoints }: RewardCardProps) {

    return (
        <View className='w-[240px] flex flex-col items-center bg-neutral-100 rounded-xl'>
            <RewardImage
                url={data.image_url}
                width='100%'
                height={160}
            />

            <View className='flex flex-col items-center py-5 gap-2'>
                <View className='flex flex-row items-center gap-3'>
                    <Icon name={data.icon_name || 'Coffee'} size={36} color='black' />

                    <Large>{data.title}</Large>
                </View>

                {userPoints >= data.cost? (
                <RewardTrigger rewardData={data} />
                ) : (
                <Button disabled className='bg-transparent border border-neutral-300'>
                    <Text className='text-black'>{data.cost} points</Text>
                </Button>
                )}
            </View>
        </View>
    )
}