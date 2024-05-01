import { View } from "react-native";
import { Link } from "expo-router";

import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { H3, Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";

import { useMainContext, type MainState } from "../../context/MainContext";

import RewardTrigger from "../../components/reward-trigger";

import { Tables } from "@/types/supabase";

interface RewardCardProps {
    data: Tables<'reward_types'>
}

export default function RewardCard({ data }: RewardCardProps) {
    const { storeData, setMyRewardsIsOpen } = useMainContext() as MainState;

    return (
        <Card className='w-[180px]'>
            <CardContent className='flex flex-col items-center gap-2 px-2'>
                <View className='flex flex-col items-center'>
                    <Link href={`../../store/${data.store_id}`} asChild>
                        <Button onPress={() => setMyRewardsIsOpen(false)}>
                            <Text className=''>{storeData[data.store_id].name}</Text>
                        </Button>
                    </Link>
                    <Large>{data.title}</Large>
                </View>
                <RewardTrigger rewardData={data} />
            </CardContent>
        </Card>
    )
}