import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CalendarIcon from "../../../assets/icons/calendarIcon.svg";

interface DatePickerFieldProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  placeholder?: string;
  themeVariant?: "light" | "dark"; // <-- 1. ADICIONADO AQUI
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  maximumDate,
  minimumDate,
  placeholder = "Selecione a data",
  themeVariant = "light", // <-- 2. ADICIONADO AQUI (com valor padrão)
}) => {
  const [show, setShow] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    // No Android, fechar o modal sem selecionar data pode disparar o 'onChange'
    // com 'selectedDate' como undefined. O 'setShow(false)' garante que feche.
    setShow(false);
    if (selectedDate) {
      onChange(selectedDate); // Envia APENAS a data para o componente pai
    }
  };

  return (
    <View style={{ marginBottom: 18 }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setShow(!show)} // <-- MUDANÇA AQUI
      >
        {/* O texto "black" aqui está correto, pois o fundo do input é claro (#EDEDED) */}
        <Text style={{ paddingLeft: 18, color: value ? "black" : "#888" }}>
          {value ? value.toLocaleDateString("pt-BR") : placeholder}
        </Text>
        <View style={{ height: 25, width: 25 }}>
          <CalendarIcon />
        </View>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={handleChange}
          // --- CORREÇÃO PARA O iOS ---
          // A prop 'themeVariant' não funciona no iOS 'spinner'.
          // A prop correta para a COR DO TEXTO é 'textColor'.
          textColor={
            Platform.OS === "ios" && themeVariant === "dark"
              ? "#FFFFFF" // Branco para o modo escuro
              : "#FFFFFF" // Preto para o modo claro
          }
          // No Android, 'themeVariant' ainda pode ser útil
          themeVariant={themeVariant}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "#EDEDED",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 12,
    // Altura corrigida para 48 para bater com o NewWorkoutScreen
    height: 48,
  },
  label: {
    color: "white",
    fontSize: 16,
    paddingRight: 8,
    paddingBottom: 4,
  },
});

export default DatePickerField;