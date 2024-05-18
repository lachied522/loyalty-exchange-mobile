import { View, type DimensionValue } from "react-native";
import { Image } from "expo-image";

const DEFAULT_STORE_LOGO = require('assets/images/default-store-logo.png');

const ASPECT_RATIO = 2.5; // width / height

export default function StoreLogo({
    url,
    width = 250,
    height = 250 / ASPECT_RATIO
} : {
    url: string | null,
    width?: DimensionValue,
    height?: DimensionValue,
}) {

    return (
        <View style={{ width, height, display: 'flex' }}>
            <Image
                source={url ?? DEFAULT_STORE_LOGO}
                alt='Store Logo'
                style={{
                    width: '100%',
                    height: '100%'
                }}
                contentFit="cover"
                priority="high"
            />
        </View>
    )
}