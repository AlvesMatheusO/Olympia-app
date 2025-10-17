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

const TimePickerField = ({ label = "Horário", value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const onChangeTime = (event, selectedTime) => {
    setShowPicker(false);
    if (selectedTime) onChange(selectedTime);
  };

  const formattedTime = value
    ? value.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setShowPicker(true)}
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
  },
  inputContainer: {
    backgroundColor: "#EDEDED",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingLeft: 16,
    height: 40,
  },
  inputText: {
    color: "#000",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default TimePickerField;
