import React, { useContext, useState } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import DatePickerField from "../../components/input/DatePickerField";
import TimePickerField from "../../components/input/TimePickerField";
import { ThemeContext } from "../../../contexts/ui/ThemeContext";
import { lightTheme, darkTheme } from "../../theme/theme";
import { useRoute } from "@react-navigation/native";
import { useToast } from "../../hooks/useToast";
import Topbar from "../../components/topbar/Topbar";
import Button from "../../components/button/Button";
import { Dropdown } from "react-native-element-dropdown";

export const newMealScreen = ({ navigation }) => {
  const route = useRoute();
  const { imageUri } = route.params || {};

  const [mealTime, setMealTime] = useState(new Date());
  const [formData, setFormData] = useState({
    horario: "",
    data: "",
    descricao: "",
    tipo: "",
    image: imageUri,
  });

  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const { theme, toggleTheme } = useContext(ThemeContext);
  const currentTheme = theme === "light" ? lightTheme : darkTheme;
  const { showSuccess, showError, showInfo } = useToast();
  const isDark = theme === "dark";

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("pt-BR");
      setField("workoutDate", selectedDate);
      setField("workoutDateFormatted", formattedDate);
    }
  };

  const handleSubmit = () => {
    showSuccess("Sucesso!", "Refeição registrada");
    console.log("Dados enviados:", formData);
    setTimeout(() => navigation.navigate("Home"), 1000);
  };

  const dataTypeMeal = [
    { label: "Dieta", value: "dieta" },
    { label: "Refeição livre", value: "livre" },
    { label: "Refeição Intuitiva", value: "intuitiva" },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View
        style={[styles.container, { backgroundColor: currentTheme.background }]}
      >
        <Topbar navigation={navigation} title="Adicionar Refeição" />

        <ScrollView contentContainerStyle={styles.body}>
          {/* Título */}
          <View style={styles.item}>
            <Text style={styles.subTitle}>Título</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Digite o nome da"
                value={formData.title}
                onChangeText={(text) => setField("title", text)}
              />
            </View>
          </View>

          {/* Data */}

          <DatePickerField
            label="Data da Refeição"
            value={formData.workoutDate}
            maximumDate={new Date()}
            onChange={handleDateChange}
          />

          <TimePickerField
            label="Horário da Refeição"
            value={mealTime}
            onChange={(time) => setMealTime(time)}
          />
          
          {/* Tipo de refeição */}
          <View style={styles.item}>
            <Text style={styles.subTitle}>Tipo de Refeição</Text>
            <View style={styles.inputContainer}>
              <Dropdown
                style={styles.inputContainer}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={dataTypeMeal}
                labelField="label"
                valueField="value"
                placeholder="Selecione o tipo de Refeição"
                value={formData.tipo}
                onChange={(item) => {
                  setField(item);
                }}
              />
            </View>
          </View>

          {/* Calorias */}
          <View style={styles.item}>
            <Text style={styles.subTitle}>Calorias Estimadas</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Insira as calorias estimadas da sua refeição"
                value={formData.calories}
                onChangeText={(text) => setField("calories", text)}
              />
            </View>
          </View>

          {/* Descrição */}
          <View style={styles.item}>
            <Text style={styles.subTitle}>Descrição</Text>
            <View style={styles.inputContainerDesc}>
              <TextInput
                style={styles.inputDesc}
                placeholder="Descreva o treino..."
                value={formData.description}
                onChangeText={(text) => setField("description", text)}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Imagem */}
          {imageUri && (
            <View style={styles.item}>
              <Text style={styles.subTitle}>Registro de Refeição</Text>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            </View>
          )}

          {/* Botão */}
          <Button
            title="Registrar Refeição"
            color="#006400"
            onPress={handleSubmit}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topbar: {
    padding: 24,
    paddingTop: "15%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
  },

  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    paddingRight: 8,
    textAlign: "center",
  },

  subTitle: {
    color: "white",
    fontSize: 16,
    paddingRight: 8,
    paddingBottom: 4,
  },

  body: {
    paddingTop: 20,
    paddingHorizontal: 24,
  },

  backButton: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  titleWrapper: {
    flex: 1,
  },

  topbarTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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

  inputContainerDesc: {
    backgroundColor: "#EDEDED",
    flexDirection: "row",
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 12,
    height: 100,
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
    width: "100%",
  },

  inputDesc: {
    paddingLeft: 16,
    height: 80,
    width: "100%",
  },

  item: {
    paddingBottom: 18,
  },

  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    marginTop: 8,
    alignSelf: "flex-start",
  },
});
