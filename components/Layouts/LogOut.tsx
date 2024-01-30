import { Modal, View } from "react-native";
import tw from "../../lib/tailwind";
// import LottieView from "lottie-react-native";
import { Typography } from "../Ui/Typography";
import Button from "../Ui/Button";
import { MaterialIcons } from "@expo/vector-icons";

export const LogoutModal = ({
  open,
  onLogout,
  onCancel,
}: {
  open: boolean;
  onLogout: () => void;
  onCancel: () => void;
}) => {
  return (
    <Modal visible={open} transparent>
      <View style={tw`justify-center bg-black/30 flex-1 px-5`}>
        <View style={tw`rounded-lg px-3 py-3 bg-white`}>
          <MaterialIcons name="logout" size={54} color="gray" />
          <Typography variant="header" className={`mt-4`}>
            Hold on
          </Typography>
          <Typography variant="body" className={`mt-1 mb-3`}>
            Are you sure you want to log out the app.
          </Typography>
          <View style={tw`flex-row items-center py-2 mt-2`}>
            <Button
              text="cancel"
              onPress={onCancel}
              // textStyle={tw`text-[#FF4E00]`}
              textClass="text-black"
              containerButton={`w-[50%] bg-transparent`}
            />
            <Button
              text="LOGOUT"
              onPress={onLogout}
              containerButton={`w-[50%] bg-red-700`}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
