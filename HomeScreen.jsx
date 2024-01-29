import { Text } from "react-native";
import { MotiView } from "@motify/components";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { tailwind, color } from "react-native-tailwindcss";
import { Easing } from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Modal } from "react-native";
import { TextInput } from "react-native";
import { Audio } from "expo-av";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetBotVoiceQuery,
  useCreateBotVoiceMutation,
  useSendTextToSpeechMutation,
  useSendChatBotMessageMutation,
} from "./apiSlice";
import { ONBOARD_STEPS, selectApp, setAgentId, setApiKey, setOnboardingStep } from "./AppSlice";

const {
  flex,
  flex1,
  itemsCenter,
  justifyCenter,
  text2xl,
  hScreen,
  bgBlue200,
  bgGreen500,
  bgGreen800,
  p8,
  p10,
  roundedFull,
  shadow,
  text6xl,
  bgRed300,
  bgRed800,
  h20,
  w20,
  h64,
  h40,
  bgWhite,
  bgGray200,
  justifyEnd,
  opacity25,
  bgBlack,
  roundedTFull,
  hAuto,
  p4,
  p1,
  textXl,
  textBase,
  textGray200,
  textGray600,
  pX5,
  pY2,
  pY8,
  pY6,
  pY4,
  roundedESm,
  roundedTSm,
  wAuto,
  textWhite,
  mY5,
  mT5,
  mT2,
  border,
  borderGray200,
  borderGray300,
  borderGray400,
  textSm,
  h50,
} = tailwind;

const THREE_DAYS_IN_MS = 60 * 1000;
const NOW_IN_MS = new Date().getTime();

const dateTimeAfterThreeDays = NOW_IN_MS + THREE_DAYS_IN_MS;

export const HomeScreen = () => {
  /**
   * @type {[Audio.Recording, (Audio.Recording) => void]}
   */
  const dispatch = useDispatch();
  const [recording, setRecording] = useState();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(false);
  const [sound, setSound] = useState(null);
  const appState = useSelector(selectApp);

  const [onCreateBotVoice, voiceMutation] = useCreateBotVoiceMutation();
  const [onSendText, TextToSpeechMutate] = useSendTextToSpeechMutation();
  const [] = useSendChatBotMessageMutation();

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      setIsRecording(!isRecording);

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      // console.log("record:",recording)

      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      setIsRecording(false);
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    try {
      console.log("Stopping recording..");
      setRecording(undefined);
      const status = await recording.stopAndUnloadAsync();
      console.log("record:", status);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording?.getURI?.();
      setAudioUrl(uri);
      console.log("Recording stopped and stored at", uri);
    } catch (error) {
      if (error.code === "E_AUDIO_NODATA") {
        console.log(
          `Stop was called too quickly, no data has yet been received (${error.message})`
        );
      } else {
        console.log("STOP ERROR: ", error.code, error.name, error.message);
      }
      setIsRecording(!isRecording);
      setRecording(undefined);
    }
  }

  // async function playSound() {
  //   console.log("Loading Sound");
  //   const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
  //   setSound(sound);

  //   console.log("Playing Sound");
  //   await sound.playAsync();
  // }

  // useEffect(() => {
  //   return sound
  //     ? () => {
  //         console.log("Unloading Sound");
  //         sound.unloadAsync();
  //       }
  //     : undefined;
  // }, [sound]);

  const handleRecord = (style, isFinished, value, dicts) => {
    if (isFinished) {
      setIsRecording(false);
      stopRecording();
    }
  };

  const handleCreateVoice = async () => {
    try {
      const formdata = createFormData(audioUrl, {
        voice_name: "InsightBot",
        voice_description: "huy",
      });

      const result = await onCreateBotVoice(formdata).unwrap();

      // dispatch(setOnboardingStep(ONBOARD_STEPS.APP_CREDENTIAL))

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[{ flex: 1 }]}>
      <View style={[flex1, itemsCenter, justifyCenter]}>
        <Text style={[text2xl]}>InsightBot</Text>
      </View>

      <View style={[itemsCenter, justifyCenter, { flex: 5 }]}>
        {isSpeaking ? <ChatbotAvatarAnimation /> : <ChatbotAvatar />}
      </View>

      <View style={[flex1, itemsCenter, justifyCenter]}>
        <TouchableOpacity
          style={[
            h20,
            w20,
            itemsCenter,
            justifyCenter,
            shadow,
            bgRed800,
            roundedFull,
          ]}
        >
          <FontAwesome name="microphone" size={24} color={color.white} />
        </TouchableOpacity>
      </View>

      {/* Welcome */}
      <CustomModal
        isVisible={appState?.onboardingStep === ONBOARD_STEPS.WELCOME}
      >
        <View style={[p4]}>
          <Text style={[text2xl]}>Welcome to InsightBot</Text>
          <Text style={[textBase, p1, textGray600]}>
            Your personalized AI conversation partner designed to transform the
            way you interact with information.
          </Text>

          <Button
            onPress={() =>
              dispatch(setOnboardingStep(ONBOARD_STEPS.APP_CREDENTIAL))
            }
            buttonStyle={[mT5]}
          >
            Proceed
          </Button>
        </View>
      </CustomModal>

      {/* Voice recorder */}
      <CustomModal
        isVisible={appState?.onboardingStep === ONBOARD_STEPS.VOICE_RECORDER}
      >
        <View style={[p4]}>
          <Text style={[text2xl]}>Inspire InsightBot</Text>
          <Text style={[textBase, p1, textGray600]}>
            Train InsightBot with your voice or any other voice of your choice.
            Let's inspire.
          </Text>

          <View style={[h40, itemsCenter, justifyCenter, isRecording && h50]}>
            {isRecording ? (
              <UserRecordAnimation onDidAnimate={handleRecord} />
            ) : (
              <UserRecord />
            )}
          </View>

          {!isRecording && (
            <Button
              onPress={audioUrl ? handleCreateVoice : startRecording}
              buttonStyle={[mT5]}
            >
              {audioUrl ? "Proceed" : "Start Record"}
            </Button>
          )}
        </View>
      </CustomModal>

      {/* form */}
      <CustomModal
        isVisible={appState?.onboardingStep === ONBOARD_STEPS.APP_CREDENTIAL}
      >
        <View style={[p4]}>
          <Text style={[text2xl]}>Welcome to InsightBot</Text>
          <Text style={[textBase, p1, textGray600]}>
            Provide your Autogon AI apikey and agentId to use InsightBot.
          </Text>

          <View style={[mT5]}>
            <Input label="API Key" onChangeText={(text) => dispatch(setApiKey(text))} />
            <Input label="Agent Id" onChangeText={(text) => dispatch(setAgentId(text))} />
          </View>

          <Button
            onPress={() =>
              dispatch(setOnboardingStep(ONBOARD_STEPS.VOICE_RECORDER))
            }
            buttonStyle={[mT5]}
          >
            Verify
          </Button>
        </View>
      </CustomModal>
    </View>
  );
};

const ChatbotAvatarAnimation = () => {
  return (
    <View
      style={[p8, itemsCenter, justifyCenter, bgGreen800, roundedFull, shadow]}
    >
      {[...Array(3).keys()].map((index) => (
        <MotiView
          key={index}
          style={[
            StyleSheet.absoluteFillObject,
            {
              height: 100,
              width: 100,
              borderRadius: 100,
            },
            bgGreen500,
          ]}
          from={{ opacity: 0.7, scale: 1 }}
          animate={{ opacity: 0, scale: 4 }}
          transition={{
            type: "timing",
            duration: 2000,
            easing: Easing.out(Easing.ease),
            delay: index * 400,
            repeatReverse: false,
            loop: true,
          }}
        />
      ))}
      <MaterialIcons
        name="record-voice-over"
        size={44}
        color={color.green300}
      />
    </View>
  );
};
const ChatbotAvatar = () => {
  return (
    <View
      style={[p8, itemsCenter, justifyCenter, bgGreen800, roundedFull, shadow]}
    >
      <MaterialIcons
        name="record-voice-over"
        size={44}
        color={color.green300}
      />
    </View>
  );
};
const UserRecordAnimation = ({ onDidAnimate }) => {
  return (
    <View
      style={[
        h20,
        w20,
        itemsCenter,
        roundedFull,
        justifyCenter,
        bgGreen800,
        shadow,
      ]}
    >
      {[...Array(3).keys()].map((index) => (
        <MotiView
          key={index}
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: 100,
            },
            h20,
            w20,
            bgGreen500,
          ]}
          from={{ opacity: 0, scale: 4 }}
          animate={{ opacity: 0.7, scale: 1 }}
          onDidAnimate={onDidAnimate}
          transition={{
            type: "timing",
            duration: 2000,
            easing: Easing.out(Easing.ease),
            delay: index * 400,
            repeatReverse: false,
            repeat: 8,
          }}
        />
      ))}
      <FontAwesome name="microphone" size={40} color={color.green300} />
    </View>
  );
};
const UserRecord = () => {
  return (
    <View
      style={[
        h20,
        w20,
        itemsCenter,
        justifyCenter,
        bgGreen800,
        roundedFull,
        shadow,
      ]}
    >
      <FontAwesome name="microphone" size={40} color={color.green300} />
    </View>
  );
};

const CustomModal = ({ children, isVisible }) => {
  return (
    <Modal transparent visible={isVisible}>
      <View style={[flex1, justifyEnd]}>
        <View style={[bgBlack, opacity25, flex1]}></View>
        <View style={[hAuto, bgWhite]}>{children}</View>
      </View>
    </Modal>
  );
};

const Button = ({ children, buttonStyle, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[pX5, pY4, bgGreen800, wAuto, itemsCenter, ...buttonStyle]}
    >
      <Text style={[textBase, textWhite]}>{children}</Text>
    </TouchableOpacity>
  );
};

const Input = ({ label, labelStyle = [], inputStyle = [], ...input }) => {
  return (
    <View style={[mT5]}>
      <Text style={[textSm, ...labelStyle]}>{label}</Text>
      <TextInput
        style={[pY4, border, mT2, borderGray400, roundedTSm, ...inputStyle]}
        {...input}
      />
    </View>
  );
};

export const createFormData = (audio, body) => {
  const formData = new FormData();

  if (audio !== null) {
    formData.append("audio", {
      uri: audio,
      name: "user-recording",
      type: "audio/*",
    });
  }

  Object.keys(body).forEach((key) => formData.append(key, body[key]));

  return formData;
};
