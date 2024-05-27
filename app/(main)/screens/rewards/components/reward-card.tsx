import { View } from "react-native";

import { Large, Small } from "~/components/ui/typography";

import { useMainContext, type MainState } from "../../../context/MainContext";

import RewardImage from "~/app/(main)/components/reward-image";
import RewardTrigger from "~/app/(main)/components/reward-trigger";

import { Icon } from "~/components/Icons";

import { truncateText } from "@/utils/formatting";

import type { Reward } from "@/types/helpers";

function formatStoreName(text: string) {
    // truncate text manually as 'truncate' does not work in Native
    return text.length > 21? text.slice(0, 20) + '...': text;
}

interface RewardCardProps {
    rewardData: Reward,
}

export default function RewardCard({ rewardData }: RewardCardProps) {
    const { storeData } = useMainContext() as MainState;

    return (
        <View className='min-h-[380px]'>
            <Large className='text-black p-2'>
                {truncateText(storeData[rewardData.store_id].name, 24)}
            </Large>

            <View className='w-[240px] flex flex-col items-center bg-neutral-100 rounded-xl'>
                <RewardImage
                    url={rewardData.image_url || storeData[rewardData.store_id]?.store_img_url}
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

                    {rewardData.conditions && (
                    <Small className=''>
                        {'*' + rewardData.conditions}
                    </Small>
                    )}

                    <RewardTrigger rewardData={rewardData} />
                </View>
            </View>
        </View>
    )
}