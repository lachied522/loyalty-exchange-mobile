import { useEffect, useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';

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
import { Progress } from '~/components/ui/progress';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { ArrowRightLeft, ArrowBigRightDash } from '~/components/Icons';

import { cn } from '~/lib/utils';

import { useGlobalContext, type GlobalState } from '@/context/GlobalContext';
import { convertExchangePointsToStorePoints } from '@/utils/functions';
import { Large } from '~/components/ui/typography';

interface ExchangeDialogProps {
    pointsData: GlobalState['userData']['points'][number]
}

export default function ExchangeDialog({ pointsData }: ExchangeDialogProps) {
    const { userData } = useGlobalContext() as GlobalState;
    const [amount, setAmount] = useState<string>(''); // number of LoyaltyExchange points to be converted
    const [newStorePoints, setNewStorePoints] = useState<string>(''); // number of store points to receive
    const [isValid, setIsValid] = useState<boolean>(true);

    useEffect(() => {
        // adjust store points when user changes amount
        const newValue = parseFloat(amount) * 100 / pointsData.stores!.points_rate;
        setNewStorePoints((newValue || '').toString());

        if (Number(amount) > userData.points_balance) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
    }, [amount]);

    useEffect(() => {
        // set amount when user changes store points
        const newValue = parseFloat(amount) * 100 / pointsData.stores!.points_rate;
        setNewStorePoints((newValue || '').toString());
    }, [newStorePoints]);

    const available = useMemo(() => {
        // available balance
        return Math.max(userData.points_balance - (parseFloat(amount) || 0), 0);
    }, [userData.points_balance, amount]);

    const totalStorePoints = useMemo(() => {
        // total store points after exchange
        return pointsData.balance + Number(newStorePoints);
    }, [pointsData.balance, newStorePoints]);

    const onChangeAmount = (s: string) => {
        setAmount(s);
    };

    const onChangeStorePoints = (s: string) => {
        setNewStorePoints(s);
    };

    const onSubmit = () => {
        // convertExchangePointsToStorePoints(balanceRemaining, newStoreBalance, pointsData, userData);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <ArrowRightLeft size={24} color='black' />
            </DialogTrigger>
            <DialogContent className='max-h-[480px] round-full m-2'>
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <DialogHeader>
                        <DialogTitle>
                            Exchange Points
                        </DialogTitle>
                        <DialogDescription className='flex flex-col gap-4 mb-3'>
                            <Text>Convert LoyaltyExchange points to {pointsData.stores!.name} points</Text>
                        </DialogDescription>
                    </DialogHeader>
                    <View className='flex flex-col items-start py-6 gap-6'>
                        <View className='w-full flex flex-row items-center justify-between gap-4'>
                            <View className='w-[140px] flex flex-col items-start justify-start gap-1'>
                                <Input
                                    keyboardType='numeric'
                                    value={amount}
                                    onChangeText={onChangeAmount}
                                    aria-labelledbyledBy='inputLabel'
                                    aria-errormessage='inputError'
                                    className='w-[120px]'
                                />
                                <Text>{available.toLocaleString()} available</Text>
                            </View>

                            <ArrowBigRightDash size={24} color='black' className='mb-8'/>

                            <View className='w-[140px] flex flex-col items-end justify-start gap-1'>
                                <Input
                                    keyboardType='numeric'
                                    value={newStorePoints}
                                    onChangeText={onChangeStorePoints}
                                    aria-labelledbyledBy='inputLabel'
                                    aria-errormessage='inputError'
                                    className={cn('w-[120px] border-black', !isValid && 'border-red-400')}
                                />
                                {isValid? (
                                    <Text className='text-black'>{totalStorePoints.toLocaleString()} total</Text>
                                ) : (
                                    <Text className='text-red-400'>Not enough points!</Text>
                                )}
                            </View>
                        </View>

                        <View className='w-full flex flex-col items-center gap-2'>
                            <Large>Next Reward</Large>

                            <Progress value={50} className='w-[160px] border border-slate-100' />
                        </View>
                    </View>
                    <DialogFooter className='flex items-end'>
                        <DialogClose asChild>
                            <Button onPress={onSubmit} className='w-[80px] border' disabled={!isValid}>
                                <Text>OK</Text>
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </ScrollView>
            </DialogContent>
        </Dialog>
    )
}