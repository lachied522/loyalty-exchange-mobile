import { Modal, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from '~/components/ui/button';
import { H1, Large } from "~/components/ui/typography";
import { X } from '~/components/Icons';

import { useMainContext, type MainState } from "../../../context/MainContext";
import PointsTable from "./points-table";

export default function ExchangeModal() {
    const { userData, setPointsExchangeIsOpen } = useMainContext() as MainState;

    const insets = useSafeAreaInsets();

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={true}
            onRequestClose={() => setPointsExchangeIsOpen(false)}
        >
            <View className='h-full flex flex-col bg-slate-100'>
                <View className='h-[120px] w-full flex flex-row items-center justify-between bg-white px-6 pb-6' style={{ paddingTop: insets.top }}>
                    <H1>Exchange Points</H1>

                    <View className='w-12 h-12 flex items-center justify-center'>
                        <Button onPress={() => setPointsExchangeIsOpen(false)}>
                            <X size={30} color='rgb(15 23 42)' />
                        </Button>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={{ height: '100%', padding: 24, gap: 12 }}
                    keyboardShouldPersistTaps='handled'
                >
                    <View className='gap-4'>
                        <Large>Exchange</Large>

                        <Large>LoyaltyExchange Points are earned when you spend at any store on our network. These points can be converted into points at any store.</Large>
                    </View>

                    <View className='gap-4'>
                        <Large>My Stores</Large>

                        <PointsTable data={userData.points} />
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}