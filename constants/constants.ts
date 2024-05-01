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
  button: {
    shadowColor: 'rgba(0, 0, 0, 0.02)',
    shadowOffset: {
        width: 3,
        height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(27, 31, 35, 0.15)',
  },
  card: {
    shadowColor: 'rgba(0, 0, 0, 0.02)',
    shadowOffset: {
        width: 3,
        height: 3,
    },
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(27, 31, 35, 0.15)',
  },
  edge: {
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.50,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(27, 31, 35, 0.15)',
  },
  dashed: {
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.50,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(27, 31, 35, 0.15)',
    borderStyle: 'dashed',
  }
});