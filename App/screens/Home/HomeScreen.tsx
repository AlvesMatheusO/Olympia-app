import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native"
import { ThemeContext } from "../../../contexts/ui/ThemeContext";
import { lightTheme, darkTheme } from "../../theme/theme";

export const HomeScreen = () => {

      const { theme, toggleTheme } = useContext(ThemeContext);
      const currentTheme = theme === "light" ? lightTheme : darkTheme;
    
      const isDark = theme === "dark";

    return(
        <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});