import { ReactNode } from "react";
import { Modal } from "react-native";
import { AnimatePresence, MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../../lib/tailwind";

type CustomModalType = {
  onClose: () => void;
  children: ReactNode;
  open: boolean;
};

export const CustomModal = (props: CustomModalType) => {
  return (
    <Modal
      style={tw`flex-1`}
      transparent
      visible={props.open}
      onRequestClose={props.onClose}
    >
      <SafeAreaView style={tw`flex-1`}>
        <AnimatePresence exitBeforeEnter>
          <>
            <MotiView
              from={{
                opacity: 0,
                translateY: -15,
              }}
              animate={{
                opacity: props.open ? 1 : 0,
                translateY: props.open ? 0 : -15,
              }}
              transition={{
                type: "timing",
                delay: 300,
              }}
              exit={{
                opacity: 0,
                translateY: -15,
              }}
              style={tw`flex-1 bg-black/80 justify-end`}
            ></MotiView>
            <MotiView
              from={{
                opacity: 0,
                translateY: 1000,
              }}
              animate={{
                opacity: props.open ? 1 : 0,
                translateY: props.open ? 0 : 1000,
              }}
              transition={{
                type: "timing",
                duration: 500,
              }}
              exit={{
                opacity: 0,
                translateY: 1000,
              }}
              style={tw`pt-6 px-5 bg-white rounded-t-3xl absolute z-30 w-full bottom-0`}
            >
              <>{props.children}</>
            </MotiView>
          </>
        </AnimatePresence>
      </SafeAreaView>
    </Modal>
  );
};
