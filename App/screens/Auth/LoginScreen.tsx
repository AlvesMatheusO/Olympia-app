import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert, // 1. Importar Alert
  ActivityIndicator, // 2. Importar ActivityIndicator
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { useScreenDimensions } from "../../../contexts/ui/screenDimentionsContext";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// 3. Importar o hook de autenticação
import { useAuth } from "../../../contexts/auth/AuthContext"; // (Ajuste o caminho se necessário)

import Button from "../../components/button/Button";
import PasswordInput from "../../components/input/PasswordInput";

export const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { height } = useScreenDimensions();

  // 4. Pegar a função signIn do contexto
  const { signIn } = useAuth();

  // 5. Mudar 'email' para 'username' (pois nossa API espera 'username')
  //    e adicionar o estado de 'isLoading'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 6. Criar a função de login
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Erro", "Por favor, preencha o usuário e a senha.");
      return;
    }

    setIsLoading(true);
    const success = await signIn(username, password);
    setIsLoading(false);

    if (success) {
      // Sucesso! Navega para a Home e substitui a tela de login
      navigation.replace("Home");
    } else {
      // Falha! Mostra um alerta
      Alert.alert("Erro de Login", "Usuário ou senha incorretos.");
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/background/backgroundLogin.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Topo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>{"<LOGO/>"}</Text>
        </View>

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.65)"]}
          end={{ x: 0, y: 0 }}
          start={{ x: 0, y: 1 }}
          style={styles.backInput}
        >
          <View style={styles.backInput}>
            <View style={styles.inputWrapper}>
              {/* 7. Mudar o texto de 'Email' para 'Usuário' */}
              <Text style={styles.text}>Usuário</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu Usuário" // MUDADO
                  autoCapitalize="none"
                  // keyboardType="email-address" (removido)
                  onChangeText={setUsername} // MUDADO
                />
              </View>
            </View>

            <View style={{ height: 40 }} />

            <View style={styles.inputWrapper}>
              <Text style={styles.text}>Senha</Text>
              <View style={styles.inputContainer}>
                <PasswordInput
                  placeholder="Digite sua Senha"
                  autoCapitalize="none"
                  onChangeText={setPassword} // OK
                />
              </View>
            </View>

            <View style={{ height: 40 }} />

            <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate("PasswordRecovery")}>
              <Text style={{ color: "white" }}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />

            {/* 8. Lógica de Loading e Botão */}
            {isLoading ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <Button
                title="Entrar"
                color="black"
                onPress={handleLogin} // MUDADO: Chama a função de login
                // navigateTo="Home" (removido)
              />
            )}

            <TouchableOpacity
              style={styles.createAccount}
              onPress={() => navigation.navigate("Register")} // OK
            >
              <Text style={styles.createAccText}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

// ... (seus estilos permanecem os mesmos)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 72,
    // paddingHorizontal: 24,
    // nada de paddingVertical gigante que empurra tudo
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },

  logo: {
    fontWeight: "700",
    fontSize: 30,
  },

  inputWrapper: {
    gap: 4,
  },

  backInput: {
    marginTop: "auto",
    // backgroundColor: "rgba(0,0,0,0.65)",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 24,
    paddingBottom: 70,
  },

  inputContainer: {
    backgroundColor: "#EDEDED",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 12,
    height: 40,
  },

  input: {
    flex: 1,
    paddingLeft: 16,
    height: 40,
  },

  text: {
    fontSize: 16,
    color: "white",
  },

  forgotPassword: {
    alignItems: "flex-end",
  },

  createAccount: {
    alignItems: "center",
    marginTop: 12,
  },

  createAccText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});