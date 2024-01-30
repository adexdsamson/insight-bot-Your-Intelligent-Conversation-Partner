import {
  Image,
  TouchableOpacity,
  View,
  GestureResponderEvent,
  ImageSourcePropType,
} from "react-native";
import tw from "../../lib/tailwind";
import { Entypo } from "@expo/vector-icons";
import { Typography } from "./Typography";
import { getNameInitials } from "../../helpers";

export interface AvatarProps {
  editable?: boolean;
  containerClass?: string;
  imageClass?: string;
  onEdit?: (event: GestureResponderEvent) => void;
  source: ImageSourcePropType;
  text?: string;
  hasUri?: boolean;
  textStyle?: string;
}

export const Avatar = ({
  source,
  hasUri,
  text,
  editable,
  imageClass,
  onEdit,
  containerClass,
  textStyle,
  ...imgProps
}: AvatarProps) => {
  return (
    <View
      style={[
        tw`relative h-[80px] w-[80px] justify-center`,
        tw.style(
          containerClass,
          !hasUri && "items-center justify-center bg-primary/60 rounded-full"
        ),
      ]}
    >
      {hasUri && (
        <Image
          {...imgProps}
          source={source}
          style={[tw`rounded-full`, tw.style(imageClass)]}
        />
      )}

      {!hasUri && text?.length !== 0 && (
        <Typography className={textStyle}>
          {getNameInitials(text ?? "")}
        </Typography>
      )}

      {editable && (
        <TouchableOpacity
          onPress={onEdit}
          style={tw`h-[28px] w-[28px] rounded-full absolute items-center justify-center bg-green-400 bottom-1 right-1 `}
        >
          <Entypo name="plus" size={23} color="#FF4E00" />
        </TouchableOpacity>
      )}
    </View>
  );
};
