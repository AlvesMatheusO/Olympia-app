import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CalendarIcon from "../../../assets/icons/calendarIcon.svg";

interface DatePickerFieldProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  placeholder?: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  maximumDate,
  minimumDate,
  placeholder = "Selecione a data",
}) => {
  const [show, setShow] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={{ marginBottom: 18 }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setShow(true)}
      >
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
    height: 40,
  },
  label: {
    color: "white",
    fontSize: 16,
    paddingRight: 8,
    paddingBottom: 4,
  },
});

export default DatePickerField;
