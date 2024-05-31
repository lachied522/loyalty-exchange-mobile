import { useMemo } from "react";
import {
    View,
    Image,
    ImageBackground,
    useWindowDimensions,
    StyleSheet
} from "react-native";

const ASPECT_RATIO = 0.60; // width / height

const URI = Image.resolveAssetSource(require('assets/images/coupon-background.png')).uri;

export default function Coupon({
    children
} : { children: React.ReactNode } ) {
    const {
        height: screenHeight,
        width: screenWidth
    } = useWindowDimensions();

    const [width, height] = useMemo(() => {
        // ensure at least 5% gap on each side around coupon, with a max width of 540px
        const _width = Math.min(screenHeight * ASPECT_RATIO * 0.90, screenWidth * 0.90, 540);
        return [
            _width,
            _width / ASPECT_RATIO,
        ];
    }, [screenHeight, screenWidth]);

    return (
        <View>
            <ImageBackground
                src={URI}
                style={{
                    width,
                    height,
                    ...styles.container,
                }}
                resizeMode='cover'
            >
                {children}
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
})