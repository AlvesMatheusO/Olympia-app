import { useState } from "react";

import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

interface PasswordInputProps extends TextInputProps {
  iconSize?: number;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  iconSize = 24,
  ...rest
}) => {
  const [secure, setSecure] = useState(true);

  const toggleSecure = () => {
    setSecure((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <TextInput style={{ flex: 1 }} secureTextEntry={secure} {...rest} />
      <TouchableOpacity onPress={toggleSecure}>
        <Ionicons
          name={secure ? "eye-off-outline" : "eye-outline"}
          size={iconSize}
          color={"#555"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: 10,
  },
});

export default PasswordInput;
