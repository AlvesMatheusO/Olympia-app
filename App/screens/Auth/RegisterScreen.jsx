import { View, StyleSheet, TouchableOpacity, Text } from "react-native"
import BackArrow from "../../../assets/icons/arrowBack.svg";

export const RegisterScreen = ( {navigation} ) => {
    return(
        <View style={styles.container}>
            <View style={styles.topbar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackArrow />
                </TouchableOpacity>

                <Text style={{ paddingLeft: "40%", color: 'white' }}>
                    Criar conta
                </Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },

    topbar: {
        padding: 24,
        paddingTop: "13%",
        flexDirection: "row"
    },
});