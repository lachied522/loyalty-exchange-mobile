import { Link } from "expo-router";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Large } from "~/components/ui/typography";

import { shadowStyles } from "~/lib/constants";

import { useMainContext, type MainState } from "../context/MainContext";
import RewardTrigger from "./reward-trigger";

import type { Reward } from "@/types/helpers";

interface RewardCardProps {
    data: Reward
}

export default function RewardCard({ data }: RewardCardProps) {
    const { setMyRewardsIsOpen } = useMainContext() as MainState;

    return (
        <Card className='w-[180px]' style={shadowStyles.card}>
            <CardHeader className='flex flex-col items-center mb-0'>
                <CardTitle>
                    {data.reward_types?.title}
                </CardTitle>
                <CardDescription>
                    <Link href={`../../store/${data.reward_types?.store_id}`} asChild>
                        <Button onPress={() => setMyRewardsIsOpen(false)}>
                            <Large className='w-full text-yellow-400 font-display-semibold underline truncate'>Test Store</Large>
                        </Button>
                    </Link>
                </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col'>
                <RewardTrigger rewardData={data} />
            </CardContent>
        </Card>
    )
}