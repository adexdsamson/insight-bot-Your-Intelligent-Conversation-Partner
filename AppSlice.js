import { createSlice } from '@reduxjs/toolkit';

export const ONBOARD_STEPS = {
  WELCOME: "WELCOME",
  APP_CREDENTIAL: "APP_CREDENTIAL",
  VOICE_RECORDER: "VOICE_RECORDER",
};

export const appSlice = createSlice({
  name: "app",
  initialState: {
    apiKey: null,
    agentId: null,
    userName: null,
    voiceId: null,
    isExisting: false,
    onboardingStep: ONBOARD_STEPS.WELCOME
  },
  reducers: {
    setApiKey: (state, action) => {
      state.apiKey = action.payload;
    },
    setAgentId: (state, action) => {
      state.agentId = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload
    },
    setVoiceId: (state, action) => {
      state.voiceId = action.payload
    },
    setIsExisting: (state, action) => {
      state.isExisting = action.payload
    },
    setOnboardingStep: (state, action) => {
      state.onboardingStep = action.payload
    }
  }
});

const { reducer, actions } = appSlice;

export const { setAgentId, setApiKey, setUserName, setVoiceId, setIsExisting, setOnboardingStep } = actions;

export default reducer;


export const selectApp = (state) => state.app;