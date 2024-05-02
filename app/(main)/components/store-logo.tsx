import { View } from "react-native";
import { Image } from "expo-image";

const ASPECT_RATIO = 2.5; // width / height

export default function StoreLogo({
    width = 250,
    height = 250 / ASPECT_RATIO
} : { width?: number, height?: number }) {

    return (
        <View style={{ width, height }}>
            <Image
                source={require('assets/images/sample-logo.png')}
                alt='Store logo'
                style={{
                    width: '100%',
                    height: '100%'
                }}
                contentFit="cover"
            />
        </View>
    )
}