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
  Alert, // Adicionado
  ActivityIndicator, // Adicionado
} from "react-native";

import DatePickerField from "../../components/input/DatePickerField";
import TimePickerField from "../../components/input/TimePickerField";
import { ThemeContext } from "../../../contexts/ui/ThemeContext";
import { lightTheme, darkTheme } from "../../theme/theme";
import { useRoute } from "@react-navigation/native";
import { useToast } from "../../hooks/useToast";
import Topbar from "../../components/topbar/Topbar";
// import Button from "../../components/button/Button"; // Usando TouchableOpacity
import { Dropdown } from "react-native-element-dropdown";

// Importar o AuthContext e a URL da API
import { useAuth, API_BASE_URL } from "../../../contexts/auth/AuthContext";

export const newMealScreen = ({ navigation }) => {
  const route = useRoute();
  const { imageUri } = route.params || {};

  // --- Estados ---
  const [mealDate, setMealDate] = useState(new Date());
  const [mealTime, setMealTime] = useState(new Date());

  const [formData, setFormData] = useState({
    // titulo: "", // Removido
    descricao: "",
    tipo: null, // Dropdown (era 'titulo' antes)
    calorias: "", // Alterado de 'calorias_estimadas'
    image: imageUri,
  });

  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuth(); // Pegar o token
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === "light" ? lightTheme : darkTheme;
  const { showSuccess, showError } = useToast();

  const formatISODate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Pega HH:mm:ss do objeto Date
  const formatISOTime = (date) => {
    return date.toTimeString().split(" ")[0];
  };

  // --- Funções ---

  // Handler genérico para campos de texto
  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Handler para o Dropdown (novo 'tipo')
  const handleDropdownChange = (item) => {
    setFormData((prev) => ({ ...prev, tipo: item.value }));
  };

  // Handler para o envio
  const handleSubmit = async () => {
    setIsLoading(true);

    if (!accessToken) {
      showError("Erro", "Você não está autenticado.");
      setIsLoading(false);
      return;
    }

    // Validação
    if (!formData.tipo) {
      showError("Erro", "Por favor, selecione o tipo de refeição.");
      setIsLoading(false);
      return;
    }

    // 1. Criar o FormData
    const data = new FormData();

    // 2. Adicionar os campos de texto
    // (Os nomes DEVEM bater com o serializer do Django)
    data.append("tipo", formData.tipo); // 'CAFE', 'ALMOCO', 'LANCHE', 'JANTAR'
    data.append("descricao", formData.descricao);
    data.append("calorias", formData.calorias || 0); // Alterado

    // Formatar data e hora
    data.append("data", formatISODate(mealDate));
    data.append("horario", formatISOTime(mealTime));

    // 3. Adicionar a imagem (se existir)
    if (imageUri) {
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      // 'imgField' é o nome que o backend espera
      data.append("imgField", {
        uri: Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
        name: filename,
        type: type,
      });
    }

    // 4. Enviar a requisição
    try {
      const response = await fetch(`${API_BASE_URL}api/meals/`, { // Rota de Refeições
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Não definir 'Content-Type', o fetch faz isso
        },
        body: data,
      });

      if (response.ok) {
        setIsLoading(false);
        showSuccess("Sucesso!", "Refeição registrada");
        console.log("Refeição enviada com sucesso");
        setTimeout(() => navigation.navigate("Home"), 1000);
      } else {
        setIsLoading(false);
        const errorData = await response.json();
        console.error("Erro ao registrar refeição:", errorData);
        showError("Erro", "Não foi possível registrar a refeição.");
      }
    } catch (e) {
      setIsLoading(false);
      console.error("Erro de rede:", e);
      showError("Erro de Rede", "Não foi possível conectar ao servidor.");
    }
  };

  // --- ATUALIZADO: Dados do Dropdown (baseado nos Choices do Model) ---
  const dataTipoRefeicao = [
    { label: "Café da Manhã", value: "CAFE" },
    { label: "Almoço", value: "ALMOCO" },
    { label: "Lanche", value: "LANCHE" },
    { label: "Jantar", value: "JANTAR" },
  ];

  // --- Renderização ---
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

        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          {/* Título (AGORA É O DROPDOWN 'TIPO') */}
          <View style={styles.item}>
            <Text style={styles.subTitle}>Tipo de Refeição</Text>
            <Dropdown
              style={styles.inputContainer}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={dataTipoRefeicao} // <-- Dados atualizados
              labelField="label"
              valueField="value"
              placeholder="Selecione o tipo de Refeição"
              value={formData.tipo}
              onChange={handleDropdownChange} // <-- Handler atualizado
            />
          </View>

          {/* Data */}
          <DatePickerField
            label="Data da Refeição"
            value={mealDate}
            maximumDate={new Date()}
            onChange={(event, date) => date && setMealDate(date)} // Simplificado
          />

          {/* Horário */}
          <TimePickerField
            label="Horário da Refeição"
            value={mealTime}
            onChange={(event, time) => time && setMealTime(time)} // Simplificado
          />

          {/* Calorias */}
          <View style={styles.item}>
            <Text style={styles.subTitle}>Calorias Estimadas</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Insira as calorias estimadas"
                value={formData.calorias}
                onChangeText={(text) => setField("calorias", text)} // 'calorias'
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>
          </View>

          {/* Descrição */}
          <View style={styles.item}>
            <Text style={styles.subTitle}>Descrição</Text>
            <View style={styles.inputContainerDesc}>
              <TextInput
                style={styles.inputDesc}
                placeholder="Descreva sua refeição..."
                value={formData.descricao}
                onChangeText={(text) => setField("descricao", text)}
                multiline
                placeholderTextColor="#888"
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
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Registrar Refeição</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  subTitle: {
    color: "white",
    fontSize: 16,
    paddingRight: 8,
    paddingBottom: 4,
  },
  item: {
    paddingBottom: 18,
  },
  inputContainer: {
    backgroundColor: "#EDEDED",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 16, // Padding horizontal
    height: 48,
  },
  input: {
    flex: 1,
    height: "100%",
    width: "100%",
    fontSize: 16,
    color: "black", // Cor do texto
  },
  inputContainerDesc: {
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 100,
    paddingVertical: 10, // Padding vertical para multiline
  },
  inputDesc: {
    height: "100%",
    width: "100%",
    fontSize: 16,
    color: "black",
    textAlignVertical: "top",
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
  // Estilos do Dropdown
  placeholderStyle: {
    fontSize: 16,
    color: "#888",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "black",
  },
  // Estilos do Botão
  buttonContainer: {
    backgroundColor: "#006400", // Cor verde
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 48, // Margem inferior
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