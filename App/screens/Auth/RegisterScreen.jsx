import { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import PasswordInput from "../../components/input/PasswordInput";
import { Dropdown } from "react-native-element-dropdown";

import BackArrow from "../../../assets/icons/arrowBack.svg";
import CalendarIcon from "../../../assets/icons/calendarIcon";
import Button from "../../components/button/Button";
import { LinearGradient } from "expo-linear-gradient";

export const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
      const formattedDate = selectedDate.toLocaleDateString("pt-BR");
      setBirth(formattedDate);
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
            >
              <BackArrow />
            </TouchableOpacity>
            <View style={styles.titleWrapper}>
              <Text style={styles.topbarTitle}>Criar conta</Text>
            </View>
          </LinearGradient>

          <View style={styles.body}>
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
                    autoCapitalize="none"
                    keyboardType="default"
                    onChangeText={setName}
                  />
                </View>
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.inputWrapper}>
                <Text style={styles.subTitle}>Data Nascimento</Text>
                <View style={styles.inputContainerDate}>
                  <DateTimePicker
                    value={birthDate}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={handleDateChange}
                    design="material"
                  />

                  <View style={{ height: 25, width: 25 }}>
                    <CalendarIcon />
                  </View>
                </View>
              </View>
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
                  />
                </View>
              </View>
            </View>

            <View style={styles.titleSection}>
              <Text style={styles.title}> 2. Dados do atleta</Text>
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
                <Text style={styles.subTitle}>Altura</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite sua altura"
                    keyboardType="numbers-and-punctuation"
                    inputMode="numeric"
                    onChangeText={setHeight}
                  />
                </View>
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.inputWrapper}>
                <Text style={styles.subTitle}>Peso atual</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu peso atual"
                    keyboardType="numbers-and-punctuation"
                    inputMode="numeric"
                    onChangeText={setActualWeight}
                  />
                </View>
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.inputWrapper}>
                <Text style={styles.subTitle}>Peso alvo</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu peso alvo"
                    keyboardType="numbers-and-punctuation"
                    inputMode="numeric"
                    onChangeText={setGoalWeight}
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

            <View>
              <Button title="Criar conta" color="#651D1E" navigateTo="Home" />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
    // paddingTop: "15%",
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

  inputContainerDate: {
    backgroundColor: "#EDEDED",
    flexDirection: "row",
    justifyContent: "space-between",
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

  item: {
    paddingBottom: 18,
  },
});
