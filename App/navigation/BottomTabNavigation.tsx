import { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/Home/HomeScreen";
import { SettingsScreen } from "../screens/Settings/SettingsScreen";

import { ThemeContext } from "../../contexts/ui/ThemeContext";
import { lightTheme, darkTheme } from "../theme/theme";

const Tab = createBottomTabNavigator();
import Ionicons from "@expo/vector-icons/Ionicons";

export default function BottomTabContainer() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  const isDark = theme === "dark";

  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: "flex",
          height: 80,
          backgroundColor: currentTheme.background,
        },
        tabBarItemStyle: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "settings" : "settings-outline"} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
