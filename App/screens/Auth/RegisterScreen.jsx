import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import BackArrow from "../../../assets/icons/arrowBack.svg";

export const RegisterScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrow />
        </TouchableOpacity>

        <Text style={[styles.title, { paddingLeft: "36%",  }]}>Criar conta</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.titleSection}>
            <Text style={styles.title}> 1. Dados Pessoais</Text>
            <View style={styles.line}/>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  topbar: {
    padding: 24,
    paddingTop: "13%",
    flexDirection: "row",
    backgroundColor: "#651D1E"
  },

  body: {
    padding: 24
  },

  titleSection: {
    flexDirection: "row",
    alignItems: "center",
  
},

  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    paddingRight: 8,
  },
  line: {
    height: 2,
    backgroundColor: "#fff",
    width: "60%",
  }
});
