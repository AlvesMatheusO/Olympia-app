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
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { useScreenDimensions } from "../../../contexts/ui/screenDimentionsContext";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Button from "../../components/button/Button";
import PasswordInput from "../../components/input/PasswordInput";

export const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { height } = useScreenDimensions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
              <Text style={styles.text}>Email</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={setEmail}
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
                  onChangeText={setPassword}
                />
              </View>
            </View>

            <View style={{ height: 40 }} />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={{ color: "white" }}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />

            <Button title="Entrar" color="black" navigateTo="Home" />

            <TouchableOpacity
              style={styles.createAccount}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.createAccText}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

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
    height: 40
  },

  input: {
    flex: 1,
    paddingLeft: 16,
    height: 40
  },

  text: {
    fontSize: 16,
    color: "white"
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
