import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "./Store";
import { HomeScreen } from "./HomeScreen";
import "react-native-reanimated";
import "react-native-gesture-handler";
import "expo-dev-client";
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { provideBuilder } from "./components/Utils/ProviderBuilder";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const Providers = provideBuilder([
    [SafeAreaProvider, { onLayout: onLayoutRootView }],
    [Provider, { store }],
  ]);

  return (
    <Providers>
      <HomeScreen />
      <StatusBar style="auto" />
    </Providers>
  );
}
