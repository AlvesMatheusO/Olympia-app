import React, { useContext } from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../../../contexts/ui/ThemeContext";
import { lightTheme, darkTheme } from "../../theme/theme";
import { LinearGradient } from "expo-linear-gradient";

export const MealTabScreen = () => {

    const { theme } = useContext(ThemeContext);
    const currentTheme = theme === "light" ? lightTheme : darkTheme;

    return (
        <ScrollView style={[{ backgroundColor: currentTheme.background }, styles.container]}>
            <View style={styles.header}>
                <Ionicons
                    name="restaurant-outline"
                    size={22}
                    color="white"
                />
                <Text style={styles.title}>Suas refeições de hoje</Text>
            </View>

            <View>
                    
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 50
    },

    header: {
        flexDirection: "row", gap: 15
    },

    title: {
        fontSize: 20,
        color: "#FFF",
        paddingBottom: 15,
    },
});