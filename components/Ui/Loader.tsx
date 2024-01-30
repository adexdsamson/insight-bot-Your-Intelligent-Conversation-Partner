import { ActivityIndicator, View } from "react-native";
import { Modal } from "react-native";


type Loader = {
  isLoading: boolean
}

export const Loader = (props: Loader) => {
  return (
    <Modal visible={props.isLoading} transparent>
      <View className="bg-black/50 items-center justify-center flex-1">
        <ActivityIndicator size={20} color="white" />
      </View>
    </Modal>
  );
}