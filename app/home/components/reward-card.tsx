import { View, Text } from "react-native";
import { Link } from "expo-router";


import { Large } from "~/components/ui/typography";

import { Tables } from "@/types/supabase";
import RewardTrigger from "./reward-trigger";
import { useMainContext, type MainState } from "../context/MainContext";
import { Button } from "~/components/ui/button";
import type { Reward } from "@/types/helpers";

interface RewardCardProps {
    data: Reward
}

export default function RewardCard({ data }: RewardCardProps) {
    const { setMyRewardsIsOpen } = useMainContext() as MainState;

    return (
        <View className='w-[360] h-[240] flex flex-col justify-center items-stretch bg-white rounded-[50] shadow-sm gap-6 p-12'>
            <View>
                <Large>{data.reward_types?.title}</Large>
                <Link href={`./store/${data.reward_types?.store_id}`} asChild>
                    <Button onPress={() => setMyRewardsIsOpen(false)}>
                        <Text className='w-full text-slate-700 font-medium truncate'>Test Store</Text>
                    </Button>
                </Link>
            </View>

            <RewardTrigger rewardData={data} />
        </View>
    )
}