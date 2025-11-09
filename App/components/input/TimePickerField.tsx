import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

// 1. Adicionar 'themeVariant' às props
const TimePickerField = ({
  label = "Horário",
  value,
  onChange,
  themeVariant = "light",
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const onChangeTime = (event, selectedTime) => {
    setShowPicker(false);
    if (selectedTime) onChange(event, selectedTime); // Passa os dois argumentos
  };

  const formattedTime = value
    ? value.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setShowPicker(!showPicker)} // <-- 2. CORREÇÃO DO TOGGLE
      >
        <Ionicons name="time-outline" size={20} color="#333" />
        <Text style={styles.inputText}>{formattedTime}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour={true}
          onChange={onChangeTime}
          // --- 3. CORREÇÃO DA COR (iOS e Android) ---
          textColor={
            Platform.OS === "ios" && themeVariant === "dark"
              ? "#FFFFFF" // Branco
              : "#FFFFFF"// Preto
          }
          themeVariant={themeVariant}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: "white",
    fontSize: 16,
    marginBottom: 4,
    paddingRight: 8, // (Estilo de 'DatePickerField')
    paddingBottom: 4, // (Estilo de 'DatePickerField')
  },
  inputContainer: {
    backgroundColor: "#EDEDED",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingLeft: 16,
    height: 48, // <-- Padronizado com 'DatePickerField'
  },
  inputText: {
    color: "#000",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default TimePickerField;