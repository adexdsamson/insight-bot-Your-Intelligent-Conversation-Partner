import {
  Entypo,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { ForgeContainer } from "../components/Utils/ForgeContainer";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Container, Typography } from "../components";
import { useForgeForm } from "../hooks/useForgeForm";
import { useDispatch, useSelector } from "react-redux";
import { ONBOARD_STEPS, selectApp, setMessage, setOnboardingStep } from "../AppSlice";
import { useSendChatBotMessageMutation } from "../apiSlice";
import { useState } from "react";
import tw from "../lib/tailwind";
import { StatusBar } from "expo-status-bar";
import { Skeleton } from "moti/skeleton";
import { MaterialIcons } from "@expo/vector-icons";

export function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const ChatScreen = () => {
  const { ForgeForm, formState } = useForgeForm({
    defaultValues: {},
    mode: "onSubmit"
  });
  const [sessionId, setSessionId] = useState(generateUUID());
  const messages = useSelector(selectApp).messages;
  const dispatch = useDispatch();
  const agentId = useSelector(selectApp).agentId;

  const [sendMessage, mutates] = useSendChatBotMessageMutation();

  const handleMessage = async (value) => {
    dispatch(
      setMessage({
        message: value.message,
        sender_id: "sender",
        receiver_id: "CHAT_BOT",
      })
    );

    const result = await sendMessage({
      question: value.message,
      session_id: sessionId,
      agentId,
    }).unwrap();

    if (!result?.status) {
      alert(result?.message);
      return;
    }

    dispatch(
      setMessage({
        message: result.data.bot_response,
        sender_id: "CHAT_BOT",
        receiver_id: "sender",
      })
    );
  };

  return (
    <Container className="bg-gray-100 relative flex-1" noGutter>
      <View className="flex-row h-20 items-center justify-between bg-white px-3">
        <View className="flex-row items-center">
          <TouchableOpacity className="flex-row items-center mx-2 ">
            <View className="h-14 w-14 bg-green-200 rounded-full ml-0.5 items-center justify-center">
              <FontAwesome5
                name="robot"
                size={24}
                color="gray"
                style={tw`text-green-800`}
              />
            </View>
          </TouchableOpacity>
          <Typography variant="title">Insight AI</Typography>
        </View>
        <TouchableOpacity
          onPress={() =>
            dispatch(setOnboardingStep(ONBOARD_STEPS.APP_CREDENTIAL))
          }
        >
          <MaterialIcons
            name="vpn-key"
            size={24}
            style={tw`text-slate-400 mr-5`}
          />
        </TouchableOpacity>
      </View>

      {messages.length === 0 && (
        <View className="flex-1 items-center justify-center">
          <Entypo name="chat" size={54} style={tw`text-green-800`} />
          <Typography variant="title" className="w-40 text-center">
            Insight conversation bot
          </Typography>
          <Typography variant="caption" className="text-center w-60 mt-1">
            Insight chatbot will send messages from the knowledge trained on.
          </Typography>
        </View>
      )}
      {messages.length !== 0 && (
        <Container asChild noGutter>
          <ScrollView
            className="px-4 flex-1"
            contentContainerStyle={tw`pt-3`}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
          >
            <Typography variant="caption" className="text-center mb-6">
              Insight chatbot will be sending message from the knowledge trained
              on.
            </Typography>

            {messages?.map?.((item) =>
              item?.sender_id === "sender" ? (
                <SenderMessage key={item.id} message={item.message} />
              ) : (
                <ReceiverMessage key={item.id} message={item.message} />
              )
            )}
            {mutates.isLoading && <Loader />}
          </ScrollView>
        </Container>
      )}

      <Container noGutter asChild className="h-16 px-3 py-2">
        <View>
          <ForgeForm
            onSubmit={handleMessage}
            classNames="flex-row items-center justify-between"
          >
            <ForgeContainer name="message" component={CustomInput} />

            <TouchableOpacity
              type="submit"
              // disabled={props.disabled}
              className="w-12 h-12 rounded-full  bg-green-800 items-center justify-center"
            >
              <MaterialCommunityIcons name="send" size={24} color="white" />
            </TouchableOpacity>
          </ForgeForm>
        </View>
      </Container>
      <StatusBar style="auto" backgroundColor="white" />
    </Container>
  );
};

export const CustomInput = (props) => {
  let numOfLinesCompany = 0;
  return (
    <TextInput
      {...props}
      multiline={true}
      numberOfLines={numOfLinesCompany}
      onContentSizeChange={(e) => {
        numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
      }}
      className="bg-gray-200 rounded-3xl w-[85%] py-3 px-4"
      placeholder="Type your message..."
    />
  );
};

const SenderMessage = ({ message }) => {
  return (
    <View className="mb-2 items-end">
      <View
        style={{ maxWidth: "80%" }}
        className="rounded-2xl p-3 bg-slate-400 rounded-br-none"
      >
        <Typography className="text-white">{message}</Typography>
      </View>
    </View>
  );
};

const ReceiverMessage = ({ message }) => {
  return (
    <View className="mb-2">
      <View
        style={{ maxWidth: "80%" }}
        className="rounded-2xl p-3 bg-green-800 my-3 rounded-bl-none"
      >
        <Typography className="text-white">{message}</Typography>
      </View>
    </View>
  );
};

const Loader = () => {
  const colorMode = false ? "dark" : "light";
  return (
    <View className="mb-2">
      <Skeleton colorMode={colorMode} height={70} width={"60%"} />
    </View>
  );
};
