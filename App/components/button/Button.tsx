import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ButtonProps = {
  title: string;
  color: string;
  onPress?: () => void;
  navigateTo: string;
};

export default function Button({
  title,
  color,
  onPress,
  navigateTo,
}: ButtonProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // Caso seu botão tenha lógica adicionar no Parâmetro: 
  // onPress={handleLogica}

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (navigateTo) {
      navigation.navigate(navigateTo);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={handlePress}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },

  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
