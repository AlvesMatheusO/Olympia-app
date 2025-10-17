import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ArrowBack from "../../../assets/icons/arrowBack.svg";

const Topbar = ({ navigation, title = "Título" }) => {
  const isMealScreen =
    title.toLowerCase().includes("refeição") ||
    title.toLowerCase().includes("meal");

  const gradientColors = isMealScreen
    ? ["#043b04ff", "#006400"]
    : ["#B22222", "#8B0000"];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.topbar}
    >
    
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <ArrowBack />
      </TouchableOpacity>

      <View style={styles.titleWrapper}>
        <Text style={styles.topbarTitle}>{title}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  topbar: {
    padding: 24,
    paddingTop: "15%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
  },
  topbarTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Topbar;
