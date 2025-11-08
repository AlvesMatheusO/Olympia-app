import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function PasswordRecoveryFlow() {
  const navigation = useNavigation();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Tela 1: Solicitar Email
  const EmailScreen = () => (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed-outline" size={40} color="#d53535" />
          </View>
          <Text style={styles.title}>Esqueceu a senha?</Text>
          <Text style={styles.subtitle}>
            Digite seu e-mail para receber o código de recuperação
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setStep(2)}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Enviar Código</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              })
            }
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const CodeVerificationScreen = () => {
    const handleCodeChange = (text, index) => {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
    };

    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={40} color="#d53535" />
            </View>
            <Text style={styles.title}>Verificar Código</Text>
            <Text style={styles.subtitle}>
              Digite o código de 6 dígitos enviado para{"\n"}
              <Text style={styles.emailHighlight}>
                {email || "seu@email.com"}
              </Text>
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.codeInput}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  placeholderTextColor="#666"
                />
              ))}
            </View>

            <TouchableOpacity style={styles.resendButton} activeOpacity={0.7}>
              <Text style={styles.resendText}>Reenviar código</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setStep(3)}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Verificar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setStep(1)}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  // Tela 3: Nova Senha
  const NewPasswordScreen = () => (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="key-outline" size={40} color="#d53535" />
          </View>
          <Text style={styles.title}>Nova Senha</Text>
          <Text style={styles.subtitle}>
            Crie uma senha forte e segura para sua conta
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nova Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 8 caracteres"
              placeholderTextColor="#666"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a senha novamente"
              placeholderTextColor="#666"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementText}>✓ Mínimo 8 caracteres</Text>
            <Text style={styles.requirementText}>
              ✓ Pelo menos uma letra maiúscula
            </Text>
            <Text style={styles.requirementText}>✓ Pelo menos um número</Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setStep(4)}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Redefinir Senha</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  // Tela 4: Sucesso
  const SuccessScreen = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-done-outline" size={60} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Senha Redefinida!</Text>
          <Text style={styles.successSubtitle}>
            Sua senha foi alterada com sucesso.{"\n"}
            Você já pode fazer login com a nova senha.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              })
            }
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Ir para Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {step === 1 && <EmailScreen />}
      {step === 2 && <CodeVerificationScreen />}
      {step === 3 && <NewPasswordScreen />}
      {step === 4 && <SuccessScreen />}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1419" },
  content: { flexGrow: 1, padding: 24, paddingTop: 60 },
  header: { alignItems: "center", marginBottom: 40 },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#1a1f2e",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#d53535",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E0E0E0",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
    lineHeight: 22,
  },
  emailHighlight: {
    color: "#d53535",
    fontWeight: "600",
  },
  form: { flex: 1 },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    color: "#E0E0E0",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1a1f2e",
    borderWidth: 1,
    borderColor: "#2d3548",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#E0E0E0",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 8,
  },
  codeInput: {
    flex: 1,
    backgroundColor: "#1a1f2e",
    borderWidth: 2,
    borderColor: "#2d3548",
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: "bold",
    color: "#E0E0E0",
    textAlign: "center",
  },
  resendButton: { alignItems: "center", marginBottom: 24 },
  resendText: { color: "#d53535", fontSize: 14, fontWeight: "600" },
  passwordRequirements: {
    backgroundColor: "#1a1f2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#064f2c",
  },
  requirementText: {
    color: "#999",
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#d53535",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#d53535",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2d3548",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#E0E0E0",
    fontSize: 16,
    fontWeight: "600",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  successIcon: {
    width: 100,
    height: 100,
    backgroundColor: "#064f2c",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#064f2c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#E0E0E0",
    marginBottom: 16,
  },
  successSubtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
});
