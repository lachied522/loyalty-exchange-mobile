import { Link } from "expo-router";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

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
        <Card style={shadowStyles.small}>
            <CardHeader>
                <CardTitle>
                    {data.reward_types?.title}
                </CardTitle>
                <CardDescription>
                    <Link href={`./store/${data.reward_types?.store_id}`} asChild>
                        <Button onPress={() => setMyRewardsIsOpen(false)}>
                            <Text className='w-full text-slate-700 font-medium truncate'>Test Store</Text>
                        </Button>
                    </Link>
                </CardDescription>
            </CardHeader>
            <CardContent className='pb-12'>
                <RewardTrigger rewardData={data} />
            </CardContent>
        </Card>
    )
}