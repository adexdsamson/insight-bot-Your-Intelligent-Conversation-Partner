import { useState, ReactElement, memo, useCallback } from "react";
import { Dimensions, FlatList, KeyboardAvoidingView, ListRenderItem, Platform, TextInputProps, TouchableOpacity, View, ViewStyle } from "react-native";
import tw from "../../lib/tailwind";
import { Typography } from "./Typography";
import { CustomModal } from "../Utils/Model";
import { Input } from "./Input";
import { EvilIcons } from "@expo/vector-icons";

const { height } = Dimensions.get("window")

export const Select = ({
  label,
  placeholder,
  options,
  onChangeText,
  disabled,
  inputContainerStyle,
  endAdornment,
  value,
}: InputProps & {
  value: string;
}) => {
  const [visible, setVisible] = useState(false);
  const [itemHeights, setItemHeights] = useState({});
  const [query, setQuery] = useState("");
  const itemH = []

  /**
   * If the value of the variable visible is true, then set it to false. If the value of the variable
   * visible is false, then set it to true
   */
  const toggleSelect = () => {
    visible ? setVisible?.(false) : openDropdown?.();
  };

  const onItemPress = useCallback((item: option): void => {
    onChangeText?.(item?.value);
    setVisible(false);
  }, []);

  const filteredSearch = options?.filter?.((option) => {
    return (
      option?.label?.toLowerCase?.()?.indexOf?.(query?.toLowerCase?.()) != -1
    );
  });

  const getItemLayout = (data: any, index: number) => {
    const length = itemH[index];
    const offset = itemH.slice(0, index).reduce((a, c) => a + c, 0);
    return { length, offset, index };
  };

  /* A function that returns a react element. */
  const SelectItem = memo(
    ({
      icon,
      label,
      value,
      onPress,
    }: option & { onPress: (value: option) => void }, index) => (
      <TouchableOpacity
        style={[tw`p-2.5 border-b border-primary/40 py-5 flex-row items-center`]}
        onPress={() => onPress({ icon, label, value })}
        onLayout={(object) => itemH[index] = object.nativeEvent.layout.height}
      >
        {icon}
        <Typography {...{ variant: "body", textStyle: tw`text-black/60` }}>
          {label}
        </Typography>
      </TouchableOpacity>
    )
  );

  const renderItem: ListRenderItem<option> = ({
    item,
  }): ReactElement<any, any> => (
    <SelectItem
      icon={item.icon}
      label={item.label}
      onPress={onItemPress}
      value={item.value}
    />
  );

  const openDropdown = (): void => {
    setVisible(true);
  };

  const renderDropdown = () => {
    if (visible) {
      return (
        <CustomModal
          {...{
            open: visible,
            onClose: () => setVisible(false),
          }}
        >
          <View style={tw`mb-2`}>
            <Input
              placeholder="Search"
              containerClass={`w-full rounded-xl`}
              onChangeText={(value) => setQuery(value.trim())}
              startIcon={<EvilIcons name="search" size={34} color="black" />}
            />
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <FlatList
              data={filteredSearch}
              overScrollMode="never"
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              style={{ height: height / 2 }}
              keyExtractor={(item, index) => index.toString()}
            />
          </KeyboardAvoidingView>
        </CustomModal>
      );
    }
  };

  return (
    <>
      {renderDropdown()}
      <Typography {...{ variant: "label", textStyle: tw`mb-1` }}>
        {label}
      </Typography>
      <View style={tw`relative`}>
        <TouchableOpacity
          disabled={disabled}
          style={[
            tw`px-2.5 border-b border-primary pt-2 w-full`,
            inputContainerStyle,
          ]}
          onPress={toggleSelect}
        >
          <Typography
            style={tw.style(
              value?.length !== 0 ? "text-black" : "text-[#9AA5B5]"
            )}
          >
            {(value?.length !== 0 && value) || placeholder}
          </Typography>
        </TouchableOpacity>
        <View style={tw`absolute right-3 top-4`}>{endAdornment}</View>
      </View>
    </>
  );
};


export interface option {
  label: string;
  value: string;
  icon?: JSX.Element;
}
interface InputProps extends TextInputProps {
  label?: string;
  name?: any;
  error?: string;
  labelStyle?: ViewStyle;
  textInputStyle?: ViewStyle;
  variant?: "OtpInput" | "Datepicker" | "default";
  inputContainerStyle?: ViewStyle;
  validate?: (validator: any) => { hasError: boolean; errors: any };
  options?: Array<option>;
  onSelect?: (item: string) => void;
  inputCounts?: number;
  disabled?: boolean;
  ref?: any;
  otpRef?: any;
  startAdornment?: any;
  endAdornment?: any;
  hint?: string;
  onDateChange?: any;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  onHint?: () => void;
  inputs?: any[];
  otpVariant?: "dot" | "input";
  onOtpHasValue?: (value: boolean) => void;
}