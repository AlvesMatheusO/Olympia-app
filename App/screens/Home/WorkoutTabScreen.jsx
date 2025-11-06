import React, { useContext, useState, useEffect, useRef } from "react";

import {
    View,
    Text,
    StyleSheet,
    Image,
    Animated,
    ScrollView
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../../../contexts/ui/ThemeContext";
import { lightTheme, darkTheme } from "../../theme/theme";
import { LinearGradient } from "expo-linear-gradient";
import WeekCalendar from "../../components/calendar/WeekCalendar";

export const WorkoutScreen = () => {

    const { theme } = useContext(ThemeContext);
    const currentTheme = theme === "light" ? lightTheme : darkTheme;



    return (
        <ScrollView style={[{backgroundColor: currentTheme.background}, styles.container]}>

            <WeekCalendar checkedDays={["Seg", "Qua", "Sex"]} />
            
            <View style={styles.header}>
                <Text style={styles.title}>Seu treino de hoje!</Text>
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
        paddingTop: 50
    },

    title: {
        fontSize: 20,
        color: "#FFF",
        paddingBottom: 15,
    },

    subtitle: {
         fontSize: 18,
        color: "#FFF",
     
    }
});