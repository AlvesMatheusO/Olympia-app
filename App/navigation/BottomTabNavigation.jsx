import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

import { HomeScreen } from "../screens/Home/HomeScreen";
import { SettingsScreen } from "../screens/Settings/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabContainer() {
  // 🔴 Degradê vermelho fixo
  const gradientColors = ["#B22222", "#8B0000"];

  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,

        // Fundo em degradê
        tabBarBackground: () => (
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        ),

        // Barra “flutuante”
        tabBarStyle: {
          position: "absolute",
          height: 80,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          borderRadius: 24,
          marginHorizontal: 16,
          marginBottom: 16,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -2 },
          elevation: 8,
        },

        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 0,
        },

        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "rgba(255,255,255,0.75)",

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 0,
        },

        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconPill, focused && styles.iconPillFocused]}>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="WorkoutScreen"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Treinos",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconPill, focused && styles.iconPillFocused]}>
              <Ionicons
                name={focused ? "barbell" : "barbell-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="MealScreen"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Refeições",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconPill, focused && styles.iconPillFocused]}>
              <Ionicons
                name={focused ? "restaurant" : "restaurant-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="ProgressScreen"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Progresso",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconPill, focused && styles.iconPillFocused]}>
              <Ionicons
                name={focused ? "stats-chart" : "stats-chart-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconPill: {
    borderRadius: 16,
  },
  iconPillFocused: {
    // backgroundColor: "rgba(255,255,255,0.15)", // ative se quiser realce no ícone ativo
  },
});
