import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.autogon.ai/api/v1/",
    prepareHeaders: (headers, api, getState) => {
      const app = getState()?.app;
      return headers["X-AUG-KEY"] = app?.apiKey;
    },
  }),
  endpoints: (builder) => ({
    getBotVoice: builder.query({
      query: () => ({
        url: "services/voice-cloning/voices/list/",
      }),
    }),

    createBotVoice: builder.mutation({
      query: ({ ...values }) => ({
        url: `services/voice-cloning/voices/`,
        body: { ...values },
        method: "post",
      }),
    }),

    sendTextToSpeech: builder.mutation({
      query: ({ ...values }) => ({
        url: "services/voice-cloning/tts/",
        method: "post",
        body: { ...values },
      }),
    }),

    sendChatBotMessage: builder.mutation({
      query: ({ agentId, ...values }) => ({
        url: `services/chatbot/${agentId}/chat/`,
        method: "post",
        body: { ...values },
      }),
    }),
  }),
});

export const {
  useCreateBotVoiceMutation,
  useGetBotVoiceQuery,
  useSendTextToSpeechMutation,
  useSendChatBotMessageMutation,
} = apiSlice;
