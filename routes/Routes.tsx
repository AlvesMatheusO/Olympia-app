import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Screens:
import { LoginScreen } from "../App/screens/Auth/LoginScreen";
import { RegisterScreen } from "../App/screens/Auth/RegisterScreen";
import { HomeScreen } from "../App/screens/Home/HomeScreen";
import { SettingsScreen } from "../App/screens/Settings/SettingsScreen";
import BottomTabContainer from "../App/navigation/BottomTabNavigation";

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
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

          <Stack.Screen
            name="Home"
            component={BottomTabContainer}
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
