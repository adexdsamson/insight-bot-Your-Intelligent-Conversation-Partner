import tw from "../../lib/tailwind";
import { Typography } from "./Typography";
import { ReactNode, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ToggleVisibility from "../Utils/ToggleVisibility";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

type InputProps = TextInputProps & {
  containerClass?: string;
  label?: string;
  secure?: boolean;
  startIcon?: ReactNode;
  disabled?: boolean;
  className?: string;
  isTrimValue?: boolean;
};

export const Input = (props: InputProps) => {
  const [isSecure, setIsSecure] = useState(true);

  return (
    <View className="w-full" style={tw.style(props.containerClass)}>
      <Label className="">{props?.label}</Label>

      <View className="relative">
        <View className={`absolute ios:top-2.5 android:top-2.5 left-2`}>
          {props.startIcon}
        </View>

        <TextInput
          {...props}
          autoCapitalize="none"
          value={props.value}
          onBlur={props.onBlur}
          editable={!props.disabled}
          style={[
            tw`border-primary border-b py-2 pl-1`,
            tw.style({ "pl-12": typeof props.startIcon !== "undefined" }),
            tw.style(props.className),
          ]}
          onChangeText={(value) =>
            props.onChangeText?.(
              props?.multiline || !props?.isTrimValue ? value : value?.trim()
            )
          }
          placeholder={props.placeholder}
          placeholderTextColor="#999EA7"
          selectionColor={props.selectionColor ?? "black"}
          secureTextEntry={
            props?.keyboardType === "visible-password" || props.secure
              ? isSecure
              : false
          }
          
        />

        <ToggleVisibility
          isVisible={
            props?.keyboardType === "visible-password" || props?.secure
          }
        >
          <TouchableOpacity
            style={tw`absolute right-2 ios:top-5.5 android:top-3.5`}
            onPress={() => {
              setIsSecure(!isSecure);
            }}
          >
            {isSecure ? (
              <Ionicons name="eye-off" size={23} color="gray" />
            ) : (
              <Ionicons name="eye" size={23} color="gray" />
            )}
          </TouchableOpacity>
        </ToggleVisibility>
      </View>
    </View>
  );
};

type LabelProps = {
  disable?: boolean;
  children: ReactNode;
  className?: string;
};

export const Label = (props: LabelProps) => {
  return (
    <ToggleVisibility isVisible={!props?.disable}>
      <Typography variant="label" className={props.className}>
        {props.children}
      </Typography>
    </ToggleVisibility>
  );
};
