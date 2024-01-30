import React from "react";
import { ReactNode } from "react";
import tw from "../../lib/tailwind";
import { AsChildProps, Slot } from "../Utils/Slots";
import { Dimensions, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("screen");

type ContainerProps = {
  noGutter?: boolean;
  fullHeight?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
  className?: string
};

type DefaultProps = ViewProps & ContainerProps

export type ContainerType = AsChildProps<DefaultProps, ContainerProps>;

export const Container = ({
  asChild,
  noGutter,
  children,
  fullHeight,
  fullWidth,
  className,
  ...props
}: ContainerType) => {
  const Component = asChild ? Slot : SafeAreaView;

  return (
    <Component
      {...props}
      style={[
        tw.style(className),
        tw.style({ "px-8 min-h-[600px]:px-5": !noGutter }),
        fullHeight ? { height } : null,
        fullWidth ? { width } : null,
      ]}
    >
      {children}
    </Component>
  );
};
