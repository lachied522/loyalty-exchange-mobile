import { View, type DimensionValue } from "react-native";
import { Image } from "expo-image";

const DEFAULT_STORE_LOGO = require('assets/images/default-store-logo.png');

const ASPECT_RATIO = 1.0; // width / height

export default function StoreLogo({
    url,
    width = 250,
    height = 250 / ASPECT_RATIO,
    contentFit = 'contain',
} : {
    url: string | null,
    width?: DimensionValue,
    height?: DimensionValue,
    contentFit?: "cover"|"contain"|"fill"|"none"|"scale-down"
}) {

    return (
        <View style={{ width, height, display: 'flex' }}>
            <Image
                source={url || DEFAULT_STORE_LOGO}
                alt='Store Logo'
                style={{
                    width: '100%',
                    height: '100%'
                }}
                contentFit={contentFit}
                priority='high'
            />
        </View>
    )
}