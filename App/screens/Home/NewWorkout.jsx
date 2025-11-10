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
  Alert, // Adicionado
  ActivityIndicator, // Adicionado
} from "react-native";
import DatePickerField from "../../components/input/DatePickerField";
import { ThemeContext } from "../../../contexts/ui/ThemeContext";
import { lightTheme, darkTheme } from "../../theme/theme";
import { useRoute } from "@react-navigation/native";
import { useToast } from "../../hooks/useToast";
import Topbar from "../../components/topbar/Topbar";
// import Button from "../../components/button/Button"; // Trocado por TouchableOpacity

// Importar o AuthContext e a URL da API
import { useAuth } from "../../../contexts/auth/AuthContext";
import { API_BASE_URL } from "../../../contexts/auth/AuthContext";

const formatISODate = (date) => {
    const ano = date.getFullYear();
    const mes = date.getMonth() + 1; // getMonth() é base 0, por isso +1
    const dia = date.getDate();

    // Formata com zero à esquerda
    const mesFormatado = String(mes).padStart(2, '0');
    const diaFormatado = String(dia).padStart(2, '0');

    return `${ano}-${mesFormatado}-${diaFormatado}`;
};

export const NewWorkoutScreen = ({ navigation }) => {
  const route = useRoute();
  const { imageUri } = route.params || {};

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    effortLevel: "",
    calories: "",
    duration: "", // NOVO CAMPO
    description: "",
    workoutDate: new Date(),
    // workoutDateFormatted: "", // <-- REMOVIDO, não é necessário
    image: imageUri,
  });

  // Adicionar estado de Loading
  const [isLoading, setIsLoading] = useState(false);

  // Pegar o token de acesso
  const { accessToken } = useAuth();

  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const { theme, toggleTheme } = useContext(ThemeContext);
  const currentTheme = theme === "light" ? lightTheme : darkTheme;
  const { showSuccess, showError, showInfo } = useToast();
  const isDark = theme === "dark";

  // --- CORREÇÃO 1: Assinatura da função ---
  // A função agora espera apenas 1 argumento (selectedDate),
  // que é o que o DatePickerField envia.
  const handleDateChange = (selectedDate) => {
    if (selectedDate) {
      setField("workoutDate", selectedDate);
      // Não precisamos mais do 'workoutDateFormatted'
    }
  };

  // Lógica de envio para o Backend
  const handleSubmit = async () => {
    setIsLoading(true);

    if (!accessToken) {
      showError("Erro", "Você não está autenticado.");
      setIsLoading(false);
      return;
    }

    // Como estamos enviando uma imagem, precisamos usar FormData
    const data = new FormData();

    // (Os nomes aqui DEVEM bater com o seu serializer/model do Django)
    data.append("titulo", formData.title);
    data.append("categoria", formData.category);
    data.append("nivel_esforco", formData.effortLevel);
    data.append("calorias_estimadas", formData.calories);
    data.append("duracao", formData.duration); // NOVO CAMPO
    data.append("descricao", formData.description);
    data.append("data", formatISODate(formData.workoutDate))

    // 2. Adicionar a imagem (se existir)
    if (imageUri) {
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      // --- CORREÇÃO 3: O backend espera 'imgField' e o URI precisa de ajuste no iOS
      data.append("imgField", {
        uri: Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
        name: filename,
        type: type,
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}api/workouts/`, {
        method: "POST",
        headers: {
          // NÃO defina 'Content-Type' aqui, o fetch faz isso
          // automaticamente com 'multipart/form-data'
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      });

      if (response.ok) {
        setIsLoading(false);
        showSuccess("Sucesso!", "Workout registrado");
        console.log("Workout enviado com sucesso");
        setTimeout(() => navigation.navigate("Home"), 1000);
      } else {
        setIsLoading(false);
        const errorData = await response.json();
        console.error("Erro ao registrar workout:", errorData);
        showError("Erro", "Não foi possível registrar o workout.");
      }
    } catch (e) {
      setIsLoading(false);
      console.error("Erro de rede:", e);
      showError("Erro de Rede", "Não foi possível conectar ao servidor.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View
        style={[styles.container, { backgroundColor: currentTheme.background }]}
      >
        <Topbar title="Adicionar Workout" navigation={navigation} />

        <ScrollView contentContainerStyle={styles.body}>
          {/* Título */}
          <View style={styles.item}>
            <Text style={styles.subTitle}>Título</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Digite o nome do exercício"
                value={formData.title}
                onChangeText={(text) => setField("title", text)}
              />
            </View>
          </View>

          {/* Data */}

          <DatePickerField
            label="Data de Treino"
            value={formData.workoutDate}
            maximumDate={new Date()}
            onChange={handleDateChange} // <-- Agora a assinatura bate (1 arg)
            themeVariant={theme} // <-- CORREÇÃO 2: Passando o tema
          />

          {/* Categoria */}
          <View style={styles.item}>
            <Text style={styles.subTitle}>Categoria</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ex: Força, Cardio..."
                value={formData.category}
                onChangeText={(text) => setField("category", text)}
              />
            </View>
          </View>

          {/* Esforço */}
          <View style={styles.item}>
            <Text style={styles.subTitle}>Nível de Esforço</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Leve, moderado, intenso..."
                value={formData.effortLevel}
                onChangeText={(text) => setField("effortLevel", text)}
              />
            </View>
          </View>

          {/* Calorias */}
          <View style={styles.item}>
            <Text style={styles.subTitle}>Calorias Estimadas</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Insira as calorias estimadas no seu Wearable"
                value={formData.calories}
                keyboardType="numeric" // Adicionado para facilitar
                onChangeText={(text) => setField("calories", text)}
              />
            </View>
          </View>

          {/* Duração (NOVO) */}
          <View style={styles.item}>
            <Text style={styles.subTitle}>Duração (HH:MM:SS)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ex: 00:45:00"
                value={formData.duration}
                onChangeText={(text) => setField("duration", text)}
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
              <Text style={styles.subTitle}>Registro de Treino</Text>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            </View>
          )}

          {/* Botão */}
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              isLoading && styles.buttonDisabled, // Estilo para desabilitado
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Registrar Workout</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Adicionei estilos para o botão customizado
  buttonContainer: {
    backgroundColor: "#651D1E",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 48,
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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
    height: 48, // AUMENTADO PARA PADRÃO
  },

  inputContainerDesc: {
    backgroundColor: "#EDEDED",
    flexDirection: "row",
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 12,
    height: 100,
    paddingVertical: 10, // Adicionado para multiline
  },

  inputContainerDate: {
    backgroundColor: "#EDEDED",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 12,
    height: 48, // AUMENTADO PARA PADRÃO
  },

  input: {
    flex: 1,
    // paddingLeft: 16, // Removido, já está no container
    height: "100%", // AUMENTADO
    width: "100%",
    fontSize: 16, // Adicionado
  },

  inputDesc: {
    // paddingLeft: 16, // Removido
    height: "100%", // AUMENTADO
    width: "100%",
    fontSize: 16, // Adicionado
    textAlignVertical: "top", // Garantir que comece do topo
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