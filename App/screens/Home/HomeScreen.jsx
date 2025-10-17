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

  const mockApiResponse = [
    {
      id: 1,
      type: "treino",
      title: "HIIT Full Body",
      duration: "30 min",
      timeLabel: "07:00",
      description:
        "Circuito de burpees, air squats, mountain climbers e sprints. Intensidade alta.",
      imageUri:
        "https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      type: "refeicao",
      title: "Chicken Bowl",
      calories: 420,
      timeLabel: "12:30",
      description:
        "Grilled chicken, brown rice, avocado e pico de gallo. Refeição leve e rica em proteínas.",
      imageUri:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      type: "treino",
      title: "Corrida Intervalada",
      duration: "45 min",
      timeLabel: "18:00",
      description:
        "Treino de corrida intervalada com foco em resistência e controle de ritmo.",
      imageUri:
        "https://images.unsplash.com/photo-157101u9613914-85f342c7e95e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 4,
      type: "refeicao",
      title: "Smoothie Verde",
      calories: 250,
      timeLabel: "08:00",
      description:
        "Smoothie de couve, maçã, banana e gengibre. Ideal para começar o dia com energia.",
      imageUri:
        "https://images.unsplash.com/photo-1572441710534-680c5298e9f8?q=80&w=1200&auto=format&fit=crop",
    },
  ];

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
          />
          <View style={styles.titleWrapper}>
            <Text style={styles.topbarTitle}>Olympia</Text>
          </View>
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {mockApiResponse.length > 0 ? (
          mockApiResponse.map((item) => {
            const targetRoute =
              item.type === "treino" ? "WorkoutDetails" : "MealDetails";
            const CardComponent =
              item.type === "treino" ? WorkoutCard : MealCard;

            return (
              <CardComponent
                key={item.id}
                {...item}
                onPress={() => navigation.navigate(targetRoute, { item })}
              />
            );
          })
        ) : (
          <Text style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
            Nenhum treino ou refeição registrada ainda.
          </Text>
        )}
      </ScrollView>

      <AddRecordBtn
        actions={[
          {
            label: "Adicionar Treino",
            icon: "barbell-outline",
            route: "Camera",
            params: { type: "treino" },
          },
          {
            label: "Adicionar Refeição",
            icon: "restaurant-outline",
            route: "Camera",
            params: { type: "refeicao" },
          },
        ]}
        bottomOffset={tabBarHeight + 24}
        rightOffset={24}
        color="#d53535ff"
        tintLabel="#FFF"
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
    paddingBottom: 100,
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
