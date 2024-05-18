import { useMemo } from "react";
import { View } from "react-native";

import { Button } from "~/components/ui/button";
import { Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";

import { useMainContext, type MainState } from "../../../context/MainContext";

import RewardImage from "~/app/(main)/components/reward-image";
import RewardTrigger from "~/app/(main)/components/reward-trigger";

import { Icon } from "~/components/Icons";

import type { Reward } from "@/types/helpers";

function formatStoreName(text: string) {
    // tailwind doesn't seem to truncate text, even with set width
    return text.length > 21? text.slice(0, 20) + '...': text;
}

interface RewardCardProps {
    data: Reward,
}

export default function RewardCard({ data }: RewardCardProps) {
    const { userData, storeData } = useMainContext() as MainState;

    const userPoints = useMemo(() => {
        return userData.points.find((obj) => obj.store_id===data.store_id)?.balance || 0;
    }, [userData, storeData]);

    return (
        <View className='flex flex-col gap-1'>
            <Large className='text-black p-2'>
                {formatStoreName(storeData[data.store_id].name)}
            </Large>

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
        </View>
    )
}