import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './Store';
import { HomeScreen } from './HomeScreen';
import "react-native-reanimated";
import "react-native-gesture-handler";
import "expo-dev-client";


export default function App() {
  return (
    <Provider {...{ store }} >
      <HomeScreen />
      <StatusBar style="auto" />
    </Provider>
  );
}
