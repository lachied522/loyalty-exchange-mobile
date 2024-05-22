import { View } from "react-native";

import { Large } from "~/components/ui/typography";
import { Icon } from "~/components/Icons";

import { type MainState, useMainContext } from "~/app/(main)/context/MainContext";
import RewardTrigger from "~/app/(main)/components/reward-trigger";
import RewardImage from "~/app/(main)/components/reward-image";

import type { Reward } from "@/types/helpers";

interface RewardCardProps {
    rewardData: Reward,
}

export default function RewardCard({ rewardData }: RewardCardProps) {
    const { storeData } = useMainContext() as MainState;

    return (
        <View className='w-[240px] flex flex-col items-center bg-neutral-100 rounded-xl'>
            <RewardImage
                url={rewardData.image_url || storeData[rewardData.store_id]?.store_img_url}
                width='100%'
                height={160}
            />

            <View className='flex flex-col items-center py-5 gap-2'>
                <View className='flex flex-row items-center gap-2'>
                    <Icon name={rewardData.icon_name || 'PartyPopper'} size={32} color='black' />

                    <Large>{rewardData.title}</Large>
                </View>

                <RewardTrigger rewardData={rewardData} />
            </View>
        </View>
    )
}