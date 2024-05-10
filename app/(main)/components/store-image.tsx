import { useState } from "react";
import { View, type DimensionValue } from "react-native";
import { Image } from "expo-image";

import { useMainContext, type MainState } from "../context/MainContext";
import { Skeleton } from "~/components/ui/skeleton";

const SAMPLE_IMAGE_URL = 'https://fxeakctvzbmidqxxpnfc.supabase.co/storage/v1/object/public/stores/artem-gavrysh-F6-U5fGAOik-unsplash-1.jpg';

const ASPECT_RATIO = 1.0; // width / height

export default function StoreImage({
    storeID,
    width = 180,
    height = 180 / ASPECT_RATIO,
    rounded = true,
    contentFit = "cover",
    tintColor = null
} : {
    storeID: string,
    width?: DimensionValue,
    height?: DimensionValue,
    rounded?: boolean
    contentFit?: "cover"|"contain"|"fill"|"none"|"scale-down"
    tintColor?: string|null
}) {
    const { storeData } = useMainContext() as MainState;
    const [isLoading, setIsLoading] = useState<boolean>(true);

    return (
        <View style={{ width, height, display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
            <Image
                source={SAMPLE_IMAGE_URL}
                alt='Store Image'
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: rounded? 12: 0
                }}
                contentFit={contentFit}
                tintColor={tintColor}
                onLoad={() => setIsLoading(false)}
            />
            {/* {isLoading && <Skeleton className='flex-1 rounded-xl' />} */}
        </View>
    )
}