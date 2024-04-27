import { useState } from 'react';
import { View, Alert } from 'react-native';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

import { useGlobalContext, type GlobalState } from '@/context/GlobalContext';

import RewardModal from "./reward-modal";

import type { Reward } from '@/types/helpers';

interface RewardProps {
    rewardData: Reward
}

export default function RewardTrigger({ rewardData }: RewardProps) {
    const { redeemReward } = useGlobalContext() as GlobalState;
    const [isOpen, setIsOpen] = useState<boolean>(false); // render reward modal only once use has confirmed
    const [isDisabled, setIsDisabled] = useState<boolean>(false); // disable open button after first click

    const onRedeem = async () => {
        setIsDisabled(true);
        return await redeemReward(rewardData)
        .then(() => setIsOpen(true))
        .finally(() => setIsDisabled(false));
    }

    const onPress = () => {
        Alert.alert(
            'Are you sure?',
            'This reward can only be opened once. Make sure you are ready to redeem this reward now.',
            [
                {
                    text: 'Cancel'
                },
                {
                    text: 'OK',
                    onPress: () => {
                        onRedeem();
                    },
                }
            ]
        )
    }

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {isOpen && <RewardModal rewardData={rewardData} />}
            
            {rewardData.redeemed ? (
                <Button disabled={isDisabled} className='bg-slate-100'>
                    <Text>Redeemed</Text>
                </Button>
            ) : (
                <Button onPress={onPress} disabled={isDisabled} className='bg-yellow-400'>
                    <Text>Redeem</Text>
                </Button>
            )}
        </View>
    )
}

function AlertDialog({ children, onPress }: { 
    children: React.ReactNode,
    onPress: () => void
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className='round-full m-2'>
                <DialogHeader>
                    <DialogTitle>
                        Are you sure?
                    </DialogTitle>
                    <DialogDescription>
                        This reward can only be opened once. Make sure you are ready to redeem this reward now.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='flex flex-row items-center justify-between'>
                    <DialogClose asChild>
                        <Button className='w-[80px] border border-slate-200'>
                            <Text>Cancel</Text>
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onPress={onPress} className='border border-slate-200'>
                            <Text>Redeem</Text>
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}