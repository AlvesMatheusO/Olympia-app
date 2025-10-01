import { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ThemeContext } from "../../../contexts/ui/ThemeContext";
import { lightTheme, darkTheme } from "../../theme/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import AddRecordBtn from "../../components/button/AddRecordBtn";
import MealCard from "../../components/card/MealCard";
import WorkoutCard from "../../components/card/WorkoutCard";

export const HomeScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  const isDark = theme === "dark";

  const tabBarHeight = useBottomTabBarHeight();
  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View>
        <LinearGradient
          colors={["#B22222", "#8B0000"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topbar}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          ></TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.topbarTitle}>Olympia</Text>
          </View>
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <MealCard
          title="Chicken Bowl"
          calories={420}
          timeLabel="12:30 PM"
          description="Grilled chicken, brown rice, avocado and pico de gallo."
          imageUri="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop"
        />

        <WorkoutCard
          title="HIIT Full Body"
          duration="30 min"
          timeLabel="7:00 AM"
          description="Circuito de burpees, air squats, mountain climbers e sprints. Intensidade alta."
          imageUri="https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1200&auto=format&fit=crop"
          onPress={() => navigation.navigate("WorkoutScreen", { id: 2 })}
        />
      </ScrollView>

      <AddRecordBtn
        actions={[
          {
            label: "Adicionar Treino",
            icon: "barbell-outline",
            route: "Camera",
          },
          {
            label: "Adicionar Refeição",
            icon: "restaurant-outline",
            route: "SettingsScreen",
          },
        ]}
        bottomOffset={tabBarHeight + 24}
        rightOffset={24}
        color="#ffbf00ff"
        tintLabel="#111827"
      />
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

  body: {
    paddingTop: 20,
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
});
