import { useState } from "react";
import { View, type DimensionValue } from "react-native";
import { Image } from "expo-image";

import { Skeleton } from "~/components/ui/skeleton";

const DEFAULT_STORE_IMAGE = require('assets/images/default-reward-image.jpg');

const ASPECT_RATIO = 1.0; // width / height

export default function RewardImage({
    url,
    width = 180,
    height = 180 / ASPECT_RATIO,
    rounded = true,
    contentFit = "cover",
    tintColor = null
} : {
    url: string | null,
    width?: DimensionValue,
    height?: DimensionValue,
    rounded?: boolean
    contentFit?: "cover"|"contain"|"fill"|"none"|"scale-down"
    tintColor?: string|null
}) {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    return (
        <View style={{ width, height, display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
            <Image
                source={url || DEFAULT_STORE_IMAGE}
                alt='Store Image'
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: rounded? 12: 0,
                    opacity: 0.9
                }}
                contentFit={contentFit}
                tintColor={tintColor}
                onLoad={() => setIsLoading(false)}
            />
            {/* {isLoading && <Skeleton className='flex-1 rounded-xl' />} */}
        </View>
    )
}