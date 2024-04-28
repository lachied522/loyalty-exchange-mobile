import { Link } from "expo-router";

import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { H3, Large } from "~/components/ui/typography";

import { useMainContext, type MainState } from "../../context/MainContext";

import RewardTrigger from "./reward-trigger";

import type { Reward } from "@/types/helpers";

interface RewardCardProps {
    data: Reward
}

export default function RewardCard({ data }: RewardCardProps) {
    const { storeData, setMyRewardsIsOpen } = useMainContext() as MainState;

    return (
        <Card className='w-[180px]'>
            <CardContent className='flex flex-col items-center gap-2 p-6'>
                <H3>{data.reward_types?.title}</H3>
                <Link href={`../../store/${data.reward_types?.store_id}`} asChild>
                    <Button onPress={() => setMyRewardsIsOpen(false)}>
                        <Large className='text-yellow-400 font-display-semibold underline'>{storeData[data.reward_types!.store_id].name}</Large>
                    </Button>
                </Link>
                <RewardTrigger rewardData={data} />
            </CardContent>
        </Card>
    )
}