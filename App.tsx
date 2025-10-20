import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context"; // Esta importação não está sendo usada
import { ToastProvider } from "./App/components/toast/ToastProvider";

import { ThemeProvider } from "./contexts/ui/ThemeContext";
import { ScreenDimensionsProvider } from "./contexts/ui/screenDimentionsContext";

// 1. Importe seu AuthProvider
import { AuthProvider } from "./contexts/auth/AuthContext"; // (Ajuste o caminho se for diferente)

import Routes from "./routes/Routes";

export default function App() {
  return (
    <View style={styles.container}>
      <ScreenDimensionsProvider>
        <ThemeProvider>
          <AuthProvider>
            <Routes />
            <ToastProvider />
          </AuthProvider>
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