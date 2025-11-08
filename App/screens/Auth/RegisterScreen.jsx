import React, { useState } from "react"; // Importar React
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert, // Para exibir erros
  ActivityIndicator, // Para feedback de loading
} from "react-native";

// Imports... (DateTimePicker, PasswordInput, etc.)
import DateTimePicker from "@react-native-community/datetimepicker";
import PasswordInput from "../../components/input/PasswordInput";
import { Dropdown } from "react-native-element-dropdown";

import BackArrow from "../../../assets/icons/arrowBack.svg";
import CalendarIcon from "../../../assets/icons/calendarIcon";
// import Button from "../../components/button/Button"; // Vamos usar TouchableOpacity
import { LinearGradient } from "expo-linear-gradient";
import DatePickerField from "../../components/input/DatePickerField";

// Importar o hook de autenticação
import { useAuth } from "../../../contexts/auth/AuthContext";

export const RegisterScreen = ({ navigation }) => {
  // Pegar a função signUp do contexto
  const { signUp } = useAuth();

  // Estados dos campos
  const [name, setName] = useState("");
  // const [birth, setBirth] = useState(""); // Não é necessário, usaremos o birthDate
  const [birthDate, setBirthDate] = useState(new Date());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [atleteLevel, setAtleteLevel] = useState(null);
  const [height, setHeight] = useState("");
  const [actualWeight, setActualWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [goal, setGoal] = useState("");

  const [sport, setSport] = useState("");
  const [frequency, setFrequency] = useState("");

  // Novos estados para loading e erro
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dataAtleteLevel = [
    { label: "Iniciante (menos de 1 ano)", value: "iniciante" },
    { label: "Intermediário (1 a 3 anos)", value: "intermediario" },
    { label: "Avançado (mais de 3 anos)", value: "avancado" },
  ];

  const dataGoal = [
    { label: "Perder peso", value: "perder_peso" },
    { label: "Ganhar massa muscular", value: "ganhar_massa" },
    { label: "Melhorar desempenho", value: "desempenho" },
    { label: "Manter condicionamento", value: "manter" },
  ];

  const dataSport = [
    { label: "Musculação", value: "musculacao" },
    { label: "Corrida", value: "corrida" },
    { label: "Ciclismo", value: "ciclismo" },
    { label: "Natação", value: "natacao" },
    { label: "Futebol", value: "futebol" },
    { label: "Lutas", value: "lutas" },
    { label: "Outros", value: "outros" },
  ];

  const dataFrequency = [
    { label: "1 a 2 vezes por semana", value: "leve" },
    { label: "3 a 4 vezes por semana", value: "moderado" },
    { label: "5 a 6 vezes por semana", value: "intenso" },
    { label: "Todos os dias", value: "diario" },
  ];

  // Função para formatar a data para o backend (ex: YYYY-MM-DD)
  const formatISODate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Função de handler para o botão de registro
  const handleRegister = async () => {
    // 1. Validação básica
    if (password !== confirmPass) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    if (
      !name ||
      !email ||
      !password ||
      !atleteLevel ||
      !height ||
      !actualWeight ||
      !goalWeight ||
      !goal ||
      !sport ||
      !frequency
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    // 2. Iniciar o loading
    setIsLoading(true);
    setError(null);

    // 3. Montar os DOIS objetos de dados

    // --- Objeto 1: Dados do Usuário (para /api/auth/register/) ---
    // (Inclui dados pessoais)
    const userRegistrationData = {
      username: email, // Backend usa username como email
      email: email,
      password: password,

      // Dados Pessoais do Usuário
      nome: name,
      birth_date: formatISODate(birthDate),
      height_cm: parseFloat(height.replace(",", ".")),
    };

    // --- Objeto 2: Dados da Meta (para /api/metas/) ---
    // (Apenas os campos do model Metas)
    const getGoalDescription = (goalType) => {
      const goalLabel = dataGoal.find(
        (item) => item.value === goalType
      )?.label;
      return `Meta principal: ${goalLabel || "Não especificado"}`;
    };

    const userGoalData = {
      tipo: goal, // "perder_peso", "ganhar_massa", etc.
      valor_inicial: parseFloat(actualWeight.replace(",", ".")),
      valor_final: parseFloat(goalWeight.replace(",", ".")),

      // Campos que o backend pode preencher, mas podemos mandar
      data_inicio: formatISODate(new Date()), // Data de hoje
      status: "ativo",
      descricao: getGoalDescription(goal), // "Meta: Perder peso"

      // Campos movidos para a Meta
      athlete_level: atleteLevel,
      sport: sport,
      frequency: frequency,

      // data_fim pode ser null
      // id_usuario será adicionado pelo backend (via token)
    };

    // 4. Chamar a função signUp (agora atualizada)
    try {
      // Passamos os dois objetos para o Contexto
      const success = await signUp(userRegistrationData, userGoalData);

      setIsLoading(false); // Parar o loading

      if (success) {
        // O signUp cuidou do login e da criação da meta
        console.log("Processo de Registro Completo! Navegando para Home...");
        navigation.navigate("Home");
      } else {
        // O erro já deve ter sido exibido pelo Alert dentro do signUp
        console.log("Falha no processo de registro.");
      }
    } catch (e) {
      setIsLoading(false);
      Alert.alert("Erro Inesperado", "Ocorreu um erro: " + e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <LinearGradient
            colors={["#B22222", "#8B0000"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.topbar}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={isLoading} // Desabilitar enquanto carrega
            >
              <BackArrow />
            </TouchableOpacity>
            <View style={styles.titleWrapper}>
              <Text style={styles.topbarTitle}>Criar conta</Text>
            </View>
          </LinearGradient>

          <View style={styles.body}>
            {/* --- Dados Pessoais --- */}
            <View style={styles.titleSection}>
              <Text style={styles.title}> 1. Dados Pessoais</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.item}>
              <View style={styles.inputWrapper}>
                <Text style={styles.subTitle}>Nome completo</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu nome completo"
                    autoCapitalize="words"
                    keyboardType="default"
                    onChangeText={setName}
                    value={name}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <DatePickerField
                label="Data de Nascimento"
                value={birthDate}
                maximumDate={new Date()}
                onChange={(date) => {
                  setBirthDate(date);
                }}
              />
            </View>

            <View style={styles.item}>
              <View style={styles.inputWrapper}>
                <Text style={styles.subTitle}>Endereço de email</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu endereço de email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    value={email}
                  />
                </View>
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.inputWrapper}>
                <Text style={styles.subTitle}>Senha</Text>
                <View style={styles.inputContainer}>
                  <PasswordInput
                    placeholder="Digite sua Senha"
                    autoCapitalize="none"
                    onChangeText={setPassword}
                    value={password}
                  />
                </View>
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.inputWrapper}>
                <Text style={styles.subTitle}>Confirmar senha</Text>
                <View style={styles.inputContainer}>
                  <PasswordInput
                    placeholder="Digite sua Senha"
                    autoCapitalize="none"
                    onChangeText={setConfirmPass}
                    value={confirmPass}
                  />
                </View>
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.inputWrapper}>
                <Text style={styles.subTitle}>Altura (cm)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite sua altura em cm"
                    keyboardType="numeric"
                    onChangeText={setHeight}
                    value={height}
                  />
                </View>
              </View>
            </View>

            {/* --- Dados da Meta (Atleta) --- */}
            <View style={styles.titleSection}>
              <Text style={styles.title}> 2. Dados da Meta</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.item}>
              <View style={styles.inputWrapper}>
                <Text style={styles.subTitle}>Nível de atividade</Text>
                <Dropdown
                  style={styles.inputContainer}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={dataAtleteLevel}
                  labelField="label"
                  valueField="value"
                  placeholder="Selecione sua atividade"
                  value={atleteLevel}
                  onChange={(item) => {
                    setAtleteLevel(item.value);
                  }}
                />
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.inputWrapper}>
                <Text style={styles.subTitle}>Peso atual (kg)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu peso atual em kg"
                    keyboardType="numeric"
                    onChangeText={setActualWeight}
                    value={actualWeight}
                  />
                </View>
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.inputWrapper}>
                <Text style={styles.subTitle}>Peso alvo (kg)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu peso alvo em kg"
                    keyboardType="numeric"
                    onChangeText={setGoalWeight}
                    value={goalWeight}
                  />
                </View>
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.inputWrapper}>
                <Text style={styles.subTitle}>Objetivo</Text>
                <Dropdown
                  style={styles.inputContainer}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={dataGoal}
                  labelField="label"
                  valueField="value"
                  placeholder="Selecione seu objetivo"
                  value={goal}
                  onChange={(item) => {
                    setGoal(item.value);
                  }}
                />
              </View>
            </View>

            {/* --- Ficha do Esporte (Meta) --- */}
            <View style={styles.titleSection}>
              <Text style={styles.title}> 3. Ficha do esporte</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.item}>
              <View style={styles.inputWrapper}>
                <Text style={styles.subTitle}>Esporte</Text>
                <Dropdown
                  style={styles.inputContainer}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={dataSport}
                  labelField="label"
                  valueField="value"
                  placeholder="Selecione seu esporte"
                  value={sport}
                  onChange={(item) => {
                    setSport(item.value);
                  }}
                />
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.inputWrapper}>
                <Text style={styles.subTitle}>Frequência</Text>
                <Dropdown
                  style={styles.inputContainer}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={dataFrequency}
                  labelField="label"
                  valueField="value"
                  placeholder="Selecione sua frequência de treino"
                  value={frequency}
                  onChange={(item) => {
                    setFrequency(item.value);
                  }}
                />
              </View>
            </View>

            {/* --- Botão de Ação --- */}
            <View>
              <TouchableOpacity
                style={[
                  styles.buttonContainer,
                  isLoading && styles.buttonDisabled, // Estilo para desabilitado
                ]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Criar conta</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Estilos
const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "black",
    paddingBottom: 90,
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  topbar: {
    padding: 24,
    paddingTop: "15%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
    transform: [{ translateX: -20 }],
  },
  topbarTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  subTitle: {
    color: "white",
    fontSize: 16,
    paddingRight: 8,
    paddingBottom: 4,
  },
  line: {
    height: 1,
    backgroundColor: "#fff",
    width: "60%",
  },
  body: {
    padding: 24,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    paddingRight: 8,
    textAlign: "center",
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  inputWrapper: {
    gap: 4,
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: "#EDEDED",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 12,
    height: 48,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "black",
  },
  item: {
    // Estilos de item (se necessário)
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#888",
    paddingLeft: 4,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "black",
    paddingLeft: 4,
  },
  buttonContainer: {
    backgroundColor: "#651D1E",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});