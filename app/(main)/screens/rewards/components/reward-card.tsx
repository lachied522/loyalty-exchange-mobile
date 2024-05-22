import { View } from "react-native";

import { Large } from "~/components/ui/typography";

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
    rewardData: Reward,
}

export default function RewardCard({ rewardData }: RewardCardProps) {
    const { storeData } = useMainContext() as MainState;

    return (
        <View className='flex flex-col gap-1'>
            <Large className='text-black p-2'>
                {formatStoreName(storeData[rewardData.store_id].name)}
            </Large>

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
        </View>
    )
}