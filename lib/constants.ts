import { StyleSheet } from "react-native";

export const NAV_THEME = {
  light: {
    background: 'hsl(0 0% 100%)', // background
    border: 'hsl(240 5.9% 90%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(0 84.2% 60.2%)', // destructive
    primary: 'hsl(240 5.9% 10%)', // primary
    text: 'hsl(240 10% 3.9%)', // foreground
  },
  dark: {
    background: 'hsl(240 10% 3.9%)', // background
    border: 'hsl(240 3.7% 15.9%)', // border
    card: 'hsl(240 10% 3.9%)', // card
    notification: 'hsl(0 72% 51%)', // destructive
    primary: 'hsl(0 0% 98%)', // primary
    text: 'hsl(0 0% 98%)', // foreground
  },
};

// shadows are not visible with nativewind, see https://stackoverflow.com/questions/73372647/tailwind-css-in-react-native-box-shadow
export const shadowStyles = StyleSheet.create({
  medium: {
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 6,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,

      elevation: 6,
  },
  small: {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4,

    elevation: 6,
}
});