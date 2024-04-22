import { useState } from 'react';
import { View, Alert } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

import RewardModal from "./reward-modal";

export default function Reward() {
    const [isOpen, setIsOpen] = useState<boolean>(false); // render reward modal only once use has confirmed
    const [isDisabled, setIsDisabled] = useState<boolean>(false); // disable open button after first click

    const onPress = () => {
        Alert.alert('Are you sure?', 'This reward can only be opened once', [
            {
                text: 'Cancel'
            },
            {
                text: 'OK',
                onPress: () => {
                    setIsOpen(true);
                    setIsDisabled(true);
                },
            }
        ])
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {isOpen && <RewardModal data={''} />}
            
            <Button onPress={onPress} disabled={isDisabled}>
                <Text>Redeem</Text>
            </Button>
        </View>
    )
}