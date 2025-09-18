import React, { useContext } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";

import { ThemeContext } from "../../../contexts/ui/ThemeContext";
import { lightTheme, darkTheme } from "../../theme/theme";
import Ionicons from "@expo/vector-icons/Ionicons";

export const SettingsScreen = () => {

  const { theme, toggleTheme } = useContext(ThemeContext);
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  const isDark = theme === "dark";

  return (
    <View
      style={[styles.container, {flex: 1, backgroundColor: currentTheme.background }]}
    >
      <View style={[styles.card, { backgroundColor: currentTheme.cardBackground }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={[{ color: currentTheme.text, fontSize: 16 }]}>
            Dark mode
          </Text>
          <Ionicons
            name="contrast-outline"
            color={currentTheme.text}
            size={20}
          />
        </View>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    paddingHorizontal: 30,
  },

  card: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16
  },
});
