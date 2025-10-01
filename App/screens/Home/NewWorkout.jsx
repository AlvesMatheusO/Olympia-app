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
} from "react-native";
import DatePickerField from "../../components/input/DatePickerField";
import { ThemeContext } from "../../../contexts/ui/ThemeContext";
import { lightTheme, darkTheme } from "../../theme/theme";
import { useRoute } from "@react-navigation/native";

import Topbar from "../../components/topbar/Topbar";

export const NewWorkoutScreen = ({ navigation }) => {
  const route = useRoute();
  const { imageUri } = route.params || {};
  const { theme, toggleTheme } = useContext(ThemeContext);
  const currentTheme = theme === "light" ? lightTheme : darkTheme;
  const isDark = theme === "dark";

  const [title, setTitle] = useState("");

  const [workoutDate, setWorkoutDate] = useState(new Date());
  const [workoutDateFormatted, setWorkoutDateFormatted] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
      const formattedDate = selectedDate.toLocaleDateString("pt-BR");
      setBirth(formattedDate);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <Topbar navigation={navigation} />

      <ScrollView contentContainerStyle={styles.body}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.item}>
            <View style={styles.inputWrapper}>
              <Text style={styles.subTitle}>Título</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Digite o nome do exercício"
                  autoCapitalize="none"
                  onChangeText={setTitle}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <DatePickerField
              label="Data de Treino"
              value={workoutDate}
              maximumDate={new Date()}
              onChange={(date) => {
                setWorkoutDate(date);
                setWorkoutDateFormatted(date.toLocaleDateString("pt-BR"));
              }}
            />
          </View>

          <View style={styles.item}>
            <View style={styles.inputWrapper}>
              <Text style={styles.subTitle}>Categoria</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Digite o nome do exercício"
                  autoCapitalize="none"
                  onChangeText={setTitle}
                />
              </View>
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.inputWrapper}>
              <Text style={styles.subTitle}>Nível de esforço</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Digite o nome do exercício"
                  autoCapitalize="none"
                  onChangeText={setTitle}
                />
              </View>
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.inputWrapper}>
              <Text style={styles.subTitle}>Descrição</Text>
              <View style={styles.inputContainerDesc}>
                <TextInput
                  style={styles.inputDesc}
                  placeholder="Digite a descrição do exercício"
                  autoCapitalize="none"
                  onChangeText={setTitle}
                  multiline={true}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.inputWrapper}>
              <Text style={styles.subTitle}>Registro de Treino</Text>

              <Image
                source={{ uri: imageUri }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: "#ccc",
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
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
  },

  inputDesc: {
    paddingLeft: 16,
    height: 80,
  },

  item: {
    paddingBottom: 18,
  },
});
