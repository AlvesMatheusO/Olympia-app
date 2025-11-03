import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react"; // Necessário para JSX

//Screens:
import { LoginScreen } from "../App/screens/Auth/LoginScreen";
import { RegisterScreen } from "../App/screens/Auth/RegisterScreen";
import { SettingsScreen } from "../App/screens/Settings/SettingsScreen";
import BottomTabContainer from "../App/navigation/BottomTabNavigation";
import { NewWorkoutScreen } from "../App/screens/Home/NewWorkout";
import { CameraScreen } from "../App/screens/Home/CameraScreen";
import { newMealScreen } from "../App/screens/Home/NewMeal";
import { WorkoutDetailsScreen } from "../App/screens/Home/WorkoutDetailsScreen";
import { MealDetailsScreen } from "../App/screens/Home/MealDetailsScreen";

// (Não importamos a HomeScreen pois ela está dentro do BottomTabContainer)

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        {/* Esta linha força o app a sempre começar na tela de Login */}
        {/* mudar para Login */}
        <Stack.Navigator initialRouteName="Login">
          {/* Telas de Autenticação */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />

          {/* Telas do App (após o login) */}
          <Stack.Screen
            name="Home" // Esta é a rota para onde o Login vai redirecionar
            component={BottomTabContainer}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="NewWorkout"
            component={NewWorkoutScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="NewMeal"
            component={newMealScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="WorkoutDetails"
            component={WorkoutDetailsScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="MealDetails"
            component={MealDetailsScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});