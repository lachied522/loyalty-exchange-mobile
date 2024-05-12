import { View } from "react-native";
import { Link } from "expo-router";

import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { H3, Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";

import { useMainContext, type MainState } from "../../../context/MainContext";

import RewardTrigger from "../../../components/reward-trigger";

import { Icon } from "~/components/Icons";

import type { Reward } from "@/types/helpers";

function formatStoreName(text: string) {
    // tailwind doesn't seem to truncate text, even with set width
    return text.length > 16? text.slice(0, 16) + '...': text;
}

interface RewardCardProps {
    data: Reward
}

export default function RewardCard({ data }: RewardCardProps) {
    const { storeData, setMyRewardsIsOpen } = useMainContext() as MainState;

    return (
        <Card className='w-[180px]'>
            <CardContent className='flex flex-col items-center gap-2 px-2'>
                <View className='flex flex-col items-center'>
                    <Link href={`../../store/${data.store_id}`} asChild>
                        <Button onPress={() => setMyRewardsIsOpen(false)}>
                            <Text className='text-black'>
                                {formatStoreName(storeData[data.store_id].name)}
                            </Text>
                        </Button>
                    </Link>
                    <Icon name={data.icon_name || 'Coffee'} size={32} color='black' />
                    <Large>{data.title}</Large>
                </View>
                <RewardTrigger rewardData={data} />
            </CardContent>
        </Card>
    )
}