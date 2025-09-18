import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemeProvider } from "./contexts/ui/ThemeContext";
import { ScreenDimensionsProvider } from "./contexts/ui/screenDimentionsContext";
import Routes from "./routes/Routes";

export default function App() {
  return (
    <View style={styles.container}>
      <ScreenDimensionsProvider>
        <ThemeProvider>
        <Routes />
        </ThemeProvider>
      </ScreenDimensionsProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
