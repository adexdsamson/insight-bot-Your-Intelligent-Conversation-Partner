import { StyleSheet, Text, TextStyle, TextProps } from "react-native";
import { Dimensions, Platform, PixelRatio } from "react-native";
import { ReactNode } from "react";
import tw from "../../lib/tailwind";
import { AsChildProps, Slot } from "../Utils/Slots";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size: number) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

type TypographyProps = {
  variant?: "body" | "display" | "header" | "title" | "caption" | "label";
  children: ReactNode;
  className?: any;
  style?: TextStyle;
};


type DefaultProps = TextProps & TypographyProps;

export type TypographyType = AsChildProps<DefaultProps, TypographyProps>;

export const Typography = ({
  variant = "body",
  children,
  className,
  style,
  asChild
}: TypographyType) => {

  const variantStyles = {
    display: styles.display,
    header: styles.header,
    title: styles.title,
    body: styles.body,
    caption: styles.caption,
    label: styles.label,
  };

  const Component = asChild ? Slot : Text;

  return (
    <Component
      style={[
        variantStyles[variant],
        tw.style(className),
        style,
      ]}
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  display: {
    fontWeight: "700",
    fontSize: normalize(28),
    lineHeight: 46,
    fontFamily: "Inter_700Bold",
  },
  header: {
    fontWeight: "400",
    fontSize: normalize(24),
    fontFamily: "Inter_600SemiBold",
  },
  title: {
    fontWeight: "400",
    fontSize: normalize(16),
    fontFamily: "Inter_500Medium",
  },
  body: {
    fontWeight: "400",
    fontSize: normalize(14),
    fontFamily: "Inter_400Regular",
  },
  caption: {
    fontWeight: "400",
    fontSize: normalize(12),
    fontFamily: "Inter_300Light",
  },
  label: {
    fontWeight: "400",
    fontSize: normalize(12),
    fontFamily: "Inter_400Regular",
  },
});
