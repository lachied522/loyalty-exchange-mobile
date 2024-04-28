import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';

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
import { Large } from '~/components/ui/typography';
import { Text } from '~/components/ui/text';
import { ArrowBigRightDash } from '~/components/Icons';
import { cn } from '~/components/utils';

import { fetchStoresById, type StoreData } from '@/utils/crud';

import { useMainContext, type MainState } from '../../context/MainContext';

function convertToStorePoints(amount: string, rate: number) {
    return parseFloat(amount) * 100 / rate;
}

function convertToExchangePoints(amount: string, rate: number) {
    if (parseFloat(amount) > 0) return rate * 100 / parseFloat(amount);

    return 0;
}


interface ExchangeDialogProps {
    pointsData: MainState['userData']['points'][number]
    children: React.ReactNode
}

export default function ExchangeDialog({ pointsData, children }: ExchangeDialogProps) {
    const { userData, convertPoints } = useMainContext() as MainState;
    const [amount, setAmount] = useState<string>(''); // number of LoyaltyExchange points to be converted
    const [newStorePoints, setNewStorePoints] = useState<string>(''); // number of store points to receive
    const [rewardData, setRewardData] = useState<StoreData['reward_types'] | null>();
    const [isValid, setIsValid] = useState<boolean>(true); // is valid if 'amount' is less than available points

    async function fetchRewardData(store_id: string) {
        if (rewardData) return;

        fetchStoresById([store_id])
        .then((res) => {
            if (res) setRewardData(res[0].reward_types);
        });
    }

    useEffect(() => {
        // adjust store points when user changes amount
        const newValue = convertToStorePoints(amount, pointsData.stores!.points_rate);
        setNewStorePoints((newValue || '').toString());

        if (Number(amount) > userData.points_balance) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
    }, [amount, pointsData.stores]);

    useEffect(() => {
        // set amount when user changes store points
        const newValue = convertToExchangePoints(amount, pointsData.stores!.points_rate);
        setNewStorePoints((newValue || '').toString());
    }, [newStorePoints, pointsData.stores]);

    const available = useMemo(() => {
        // available balance
        return Math.max(userData.points_balance - (parseFloat(amount) || 0), 0);
    }, [userData.points_balance, amount]);

    const totalStorePoints = useMemo(() => {
        // total store points after exchange
        return pointsData.balance + Number(newStorePoints);
    }, [pointsData.balance, newStorePoints]);

    const onChangeAmount = useCallback((s: string) => {
        setAmount(s);
    }, [setAmount]);

    const onChangeStorePoints = useCallback((s: string) => {
        setNewStorePoints(s);
    }, [setNewStorePoints]);

    const onSubmit = useCallback(async () => {
        convertPoints(parseFloat(amount), pointsData.stores!.points_rate, pointsData.store_id)
        .then(() => reset());
    }, [amount, pointsData]);

    const reset = () => {
        setAmount('');
        setNewStorePoints('');
        setRewardData(null);
        setIsValid(true);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <TouchableOpacity onPress={() => fetchRewardData(pointsData.store_id)}>
                    {children}
                </TouchableOpacity>
            </DialogTrigger>
            <DialogContent className='max-h-[480px] round-full m-2'>
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <DialogHeader>
                        <DialogTitle>
                            Convert Points
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

                        <View className='w-full flex flex-col items-center gap-6'>
                            <Large>Next Reward</Large>

                            {rewardData? (
                                <>
                                    {rewardData.map((reward, index) => (
                                    <View key={`reward-${index}`} className='w-full flex flex-row items-start justify-between'>
                                        <Large>{reward.title}</Large>

                                        <View className='flex flex-col items-end gap-2'>
                                            <Progress value={50} className='w-[160px] border border-slate-100' />

                                            <Text>{Math.max(reward.cost - totalStorePoints, 0)} points to go!</Text>
                                        </View>
                                    </View>
                                    ))}
                                </>
                            ) : (
                                <View></View>
                            )}
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