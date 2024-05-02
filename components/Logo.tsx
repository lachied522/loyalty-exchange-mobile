import { View } from "react-native";
import { Image } from "expo-image";

const ASPECT_RATIO = 4.5; // width / height

export default function Logo({
    width = 300
} : { width?: number }) {

    return (
        <View style={{ width, height: width / ASPECT_RATIO }}>
            <Image
                source={require('assets/images/logo-with-name.png')}
                alt='Loyalty Exchange logo'
                style={{
                    width: '100%',
                    height: '100%'
                }}
                contentFit="cover"
            />
        </View>
    )
}