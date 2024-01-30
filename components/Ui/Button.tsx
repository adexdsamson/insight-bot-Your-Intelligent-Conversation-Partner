import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import React, { ReactNode } from "react";
import tw from "../../lib/tailwind";

type ButtonProps = {
  variant?: "default" | "secondary" | "tertiary" | "primary";
  text: string;
  containerButton?: any;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  component?: ReactNode;
  textClass?: string;
  type?: string
};

const Button = ({
  variant,
  text,
  containerButton,
  onPress,
  isLoading,
  disabled,
  startIcon,
  endIcon,
  component,
  textClass,
}: ButtonProps) => {

  return (
    <TouchableOpacity
      style={[
        tw`w-full items-center justify-center h-14 rounded-full bg-primary ${
          containerButton ?? ""
        }`,
        tw.style({ "bg-primary/60": disabled || isLoading }),
      ]}
      disabled={isLoading || disabled}
      onPress={onPress}
    >
      {isLoading ? (
        <ActivityIndicator className={``} color="white" />
      ) : (
        <Text
          style={[
            tw`text-white text-lg ${textClass}`,
            { fontFamily: "JetBrainsMono_400Regular" },
          ]}
        >
          {text}
        </Text>
      )}

      <View className={`absolute ios:top-2 android:top-3 right-4 `}>
        {endIcon}
      </View>
    </TouchableOpacity>
  );
};
export default Button;
