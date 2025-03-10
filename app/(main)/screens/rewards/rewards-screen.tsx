import { useState, useCallback } from "react";
import { Modal, ScrollView, View, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from '~/components/ui/button';
import { H3 } from "~/components/ui/typography";
import { X } from '~/components/Icons';
import { shadowStyles } from '~/constants/styling';

import { useMainContext, type MainState } from "../../context/MainContext";

import AvailableRewards from './components/available-rewards';
import RecentlyRedeemed from './components/recently-redeemed';

export default function RewardsScreen() {
    const {
        myRewardsIsOpen,
        setMyRewardsIsOpen,
        refreshUserDataAndUpdateState
    } = useMainContext() as MainState;
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const insets = useSafeAreaInsets();
    
    const onRefresh = useCallback(
        async () => {
            setIsRefreshing(true);

            // ensure refresh is shown for at least 2 seconds
            const minWaitTime = new Promise((resolve) => setTimeout(resolve, 2000));
            await Promise.all([
                refreshUserDataAndUpdateState(),
                minWaitTime
            ])
            .then(() => setIsRefreshing(false));
        },
        [setIsRefreshing, refreshUserDataAndUpdateState]
    );

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={myRewardsIsOpen}
            onRequestClose={() => setMyRewardsIsOpen(false)}
        >
            <View className='h-full flex flex-col bg-white'>
                <View className='w-full flex flex-row items-center justify-between bg-white p-3' style={{ paddingTop: insets.top, ...shadowStyles.edge }}>
                    <H3>My Rewards</H3>

                    <View className='w-12 h-12 flex items-center justify-center'>
                        <Button onPress={() => setMyRewardsIsOpen(false)}>
                            <X size={30} color='rgb(15 23 42)' />
                        </Button>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={{ gap: 12, backgroundColor: 'rgb(245 245 245)' }}
                    keyboardShouldPersistTaps='handled'
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                    }
                >
                    <AvailableRewards />

                    <RecentlyRedeemed />
                </ScrollView>
            </View>
        </Modal>
    )
}