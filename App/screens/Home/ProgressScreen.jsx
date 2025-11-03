import React, { useContext, useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ImageBackground,
    Animated,
    ScrollView
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../../../contexts/ui/ThemeContext";
import { lightTheme, darkTheme } from "../../theme/theme";
import { LinearGradient } from "expo-linear-gradient";
import FrequencyCalendar from "../../components/calendar/FrequencyCalendar";


export const ProgressScreen = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    const { theme } = useContext(ThemeContext);
    const currentTheme = theme === "light" ? lightTheme : darkTheme;


    const [treinosFeitos, setTreinosFeitos] = useState(4);
    const metaSemanal = 6;


    const [caloriasConsumidas, setCaloriasConsumidas] = useState(2000);
    const metaSemanalCalorias = 6000;


    const treinoAnim = useRef(new Animated.Value(0)).current;
    const caloriasAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const progressoTreino = treinosFeitos / metaSemanal;
        const progressoCalorias = caloriasConsumidas / metaSemanalCalorias;

        Animated.timing(treinoAnim, {
            toValue: progressoTreino,
            duration: 800,
            useNativeDriver: false,
        }).start();

        Animated.timing(caloriasAnim, {
            toValue: progressoCalorias,
            duration: 800,
            useNativeDriver: false,
        }).start();
    }, [treinosFeitos, caloriasConsumidas]);

    const treinoWidth = treinoAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    const caloriasWidth = caloriasAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    useEffect(() => {
        // Mock dos dados simulando resposta da API
        const mockResponse = {
            "2025-11-01": { treinos: [{ tipo: "Perna" }], refeicoes: [] },
            "2025-11-02": { treinos: [], refeicoes: [{ descricao: "Almoço saudável" }] },
            "2025-11-04": {
                treinos: [{ tipo: "Peito" }],
                refeicoes: [{ descricao: "Jantar leve" }],
            },
        };

        setTimeout(() => {
            setData(mockResponse);
            setLoading(false);
        }, 800);
    }, []);


    return (
        <ScrollView>
            <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
                <ImageBackground
                    source={require("../../../assets/background/cover.jpg")}
                    style={styles.cover}
                >
                    <View>
                        <Image
                            source={require("../../../assets/profile.png")}
                            style={styles.profile}
                        />
                    </View>
                </ImageBackground>

                <View style={styles.profileContainer}>
                    <Text style={[styles.profileName, { color: currentTheme.text }]}>
                        Jane Doe
                    </Text>
                </View>

                <View>
                    <Text style={styles.title}>Seu Progresso</Text>

                    <View style={styles.rowLine}>
                        <LinearGradient
                            colors={["#FF3B30", "#B22222"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.card}
                        >
                            <View style={styles.iconLabel}>
                                <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>
                                    8
                                </Text>
                                <Ionicons name={"barbell"} size={22} color={"white"} />
                            </View>
                            <Text style={[styles.text, { fontSize: 18 }]}>Exercícios</Text>
                        </LinearGradient>

                        <LinearGradient
                            colors={["#043b04ff", "#006400"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.card}
                        >
                            <View style={styles.iconLabel}>
                                <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>
                                    24
                                </Text>
                                <Ionicons name={"restaurant"} size={22} color={"white"} />
                            </View>
                            <Text style={[styles.text, { fontSize: 18 }]}>Refeições</Text>
                        </LinearGradient>
                    </View>

                    <View style={{ paddingVertical: 15 }}>
                        <FrequencyCalendar data={data} loading={loading} />

                    </View>
                    {/* 🏋️ Progresso de Treinos */}
                    <View style={{ paddingTop: 20 }}>
                        <Text style={[styles.text, { fontSize: 18 }]}>
                            Treinos essa semana
                        </Text>

                        <View style={styles.progressContainer}>
                            <Animated.View
                                style={[styles.progressBar, { width: treinoWidth }]}
                            />
                        </View>

                        <Text style={styles.progressText}>
                            {treinosFeitos}/{metaSemanal}
                        </Text>
                    </View>


                    <View style={{ paddingTop: 15 }}>
                        <Text style={[styles.text, { fontSize: 18 }]}>Calorias essa semana</Text>

                        <View style={styles.progressContainer}>
                            <Animated.View
                                style={[styles.progressBarMeal, { width: caloriasWidth }]}
                            />
                        </View>

                        <Text style={styles.progressText}>
                            {caloriasConsumidas}/{metaSemanalCalorias}
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingBottom: 100,
    },
    cover: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 150,
    },
    profile: {
        marginTop: 140,
        width: 120,
        height: 120,
        borderRadius: 100,
    },
    card: {
        padding: 20,
        alignItems: "center",
        borderRadius: 18,
        width: 160,
    },
    title: {
        fontSize: 20,
        color: "#FFF",
        paddingBottom: 15,
    },
    text: {
        fontSize: 16,
        color: "white",
    },
    profileContainer: {
        marginTop: 60,
        paddingBottom: 20,
    },
    profileName: {
        fontSize: 20,
    },
    iconLabel: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    rowLine: {
        justifyContent: "space-between",
        gap: 25,
        alignItems: "center",
        flexDirection: "row",
    },
    progressContainer: {
        width: "100%",
        height: 20,
        backgroundColor: "#e0e0e0",
        borderRadius: 10,
        overflow: "hidden",
        marginTop: 10,
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#FF3B30",
        borderRadius: 10,
    },
    progressBarMeal: {
        height: "100%",
        backgroundColor: "#006400",
        borderRadius: 10,
    },
    progressText: {
        alignSelf: "center",
        color: "#fff",
        marginTop: 6,
    },
});

export default ProgressScreen;
