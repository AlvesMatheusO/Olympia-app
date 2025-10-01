import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ArrowBack from "../../../assets/icons/arrowBack.svg"

const Topbar = ({ navigation }) => {

  return (
    <View>
      <LinearGradient
        colors={["#B22222", "#8B0000"]}
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
          <Text style={styles.topbarTitle}>Adicionar Workout</Text>
        </View>
      </LinearGradient>
    </View>
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

  topbarTitle: {
    color: 'white',
    fontSize: 18,
  }
});

export default Topbar; 
