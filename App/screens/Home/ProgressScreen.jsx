import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback, // Importar useCallback
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Animated,
  ScrollView,
  ActivityIndicator, // Importar ActivityIndicator
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../../../contexts/ui/ThemeContext";
import { lightTheme, darkTheme } from "../../theme/theme";
import { LinearGradient } from "expo-linear-gradient";
import FrequencyCalendar from "../../components/calendar/FrequencyCalendar";

// --- Imports do Backend ---
import { useAuth, API_BASE_URL } from "../../../contexts/auth/AuthContext";
import { useFocusEffect } from "@react-navigation/native"; // Importar useFocusEffect

export const ProgressScreen = () => {
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  // --- Contexto de Autenticação ---
  const { accessToken } = useAuth();

  // --- Estados para os dados ---
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [totalStats, setTotalStats] = useState(null);
  const [progressData, setProgressData] = useState(null);

  // --- Animações (sem alteração) ---
  const treinoAnim = useRef(new Animated.Value(0)).current;
  const caloriasAnim = useRef(new Animated.Value(0)).current;

  // --- Efeito para buscar os dados ---
  // Usamos useFocusEffect para re-buscar os dados toda vez que a tela entra em foco
  useFocusEffect(
    useCallback(() => {
      const fetchProgressData = async () => {
        if (!accessToken) {
          setLoading(false);
          return;
        }
        setLoading(true);

        try {
          // 1. Criar as requisições para os 3 endpoints
          const headers = { Authorization: `Bearer ${accessToken}` };
          const meRequest = fetch(`${API_BASE_URL}api/users/me/`, { headers });
          const statsRequest = fetch(
            `${API_BASE_URL}api/users/me/stats/`,
            { headers } 
          );
          const progressRequest = fetch(
            `${API_BASE_URL}api/users/me/progress/`,
            { headers }
          );

          // 2. Executar todas em paralelo
          const [meRes, statsRes, progressRes] = await Promise.all([
            meRequest,
            statsRequest,
            progressRequest,
          ]);

          // 3. Processar os resultados
          if (meRes.ok) {
            setUserData(await meRes.json());
          }
          if (statsRes.ok) {
            setTotalStats(await statsRes.json());
          }
          if (progressRes.ok) {
            setProgressData(await progressRes.json());
          }

          // Tratar erros (opcional, mas recomendado)
          if (!meRes.ok || !statsRes.ok || !progressRes.ok) {
            console.error("Falha ao buscar um ou mais dados de progresso");
          }
        } catch (error) {
          console.error("Erro de rede ao buscar progresso:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProgressData();
    }, [accessToken]) // Depende do accessToken
  );

  // --- Efeito para as Animações ---
  // Este efeito agora depende dos dados do estado 'progressData'
  useEffect(() => {
    // Dados de treino
    const treinosMeta = progressData?.progresso_treinos?.meta_sessoes || 0;
    const treinosRealizados =
      progressData?.progresso_treinos?.realizado_sessoes || 0;
    // Calcula o progresso, garante que não seja divisão por zero e não passe de 100% (Math.min)
    const progressoTreino =
      treinosMeta > 0 ? Math.min(treinosRealizados / treinosMeta, 1) : 0;

    // Dados de calorias
    const caloriasMeta =
      progressData?.progresso_calorias?.meta_consumo_semanal || 0;
    const caloriasConsumidas =
      progressData?.progresso_calorias?.consumido_semanal || 0;
    const progressoCalorias =
      caloriasMeta > 0 ? Math.min(caloriasConsumidas / caloriasMeta, 1) : 0;

    // Animar
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
  }, [progressData]); // Roda a animação sempre que 'progressData' mudar

  // --- Interpolação das Animações (sem alteração) ---
  const treinoWidth = treinoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const caloriasWidth = caloriasAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  // --- REMOVIDO o useEffect do mockResponse ---

  // --- Estado de Loading ---
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: currentTheme.background, justifyContent: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={{ color: currentTheme.text, marginTop: 10 }}>
          Carregando progresso...
        </Text>
      </View>
    );
  }

  // --- Renderização ---
  return (
    <ScrollView>
      <View
        style={[styles.container, { backgroundColor: currentTheme.background }]}
      >
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
          {/* DADO REAL */}
          <Text style={[styles.profileName, { color: currentTheme.text }]}>
            {userData?.full_name || userData?.username || "Usuário"}
          </Text>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.title}>Seu Progresso</Text>

          {/* --- STATS GERAIS --- */}
          <View style={styles.rowLine}>
            <LinearGradient
              colors={["#FF3B30", "#B22222"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.card}
            >
              <View style={styles.iconLabel}>
                {/* DADO REAL */}
                <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>
                  {totalStats?.total_treinos || 0}
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
                {/* DADO REAL */}
                <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>
                  {totalStats?.total_refeicoes || 0}
                </Text>
                <Ionicons name={"restaurant"} size={22} color={"white"} />
              </View>
              <Text style={[styles.text, { fontSize: 18 }]}>Refeições</Text>
            </LinearGradient>
          </View>

          {/* --- CALENDÁRIO --- */}
          {/* O calendário agora busca seus próprios dados, não precisa de props */}
          <View style={{ paddingVertical: 15 }}>
            <FrequencyCalendar />
          </View>

          {/* --- PROGRESSO SEMANAL: TREINOS --- */}
          <View style={{ paddingTop: 20 }}>
            <Text style={[styles.text, { fontSize: 18 }]}>
              Treinos essa semana
            </Text>
            <View style={styles.progressContainer}>
              <Animated.View
                style={[styles.progressBar, { width: treinoWidth }]}
              />
            </View>
            {/* DADOS REAIS */}
            <Text style={styles.progressText}>
              {progressData?.progresso_treinos?.realizado_sessoes || 0} /{" "}
              {progressData?.progresso_treinos?.meta_sessoes || 0}
            </Text>
          </View>

          {/* --- PROGRESSO SEMANAL: CALORIAS --- */}
          <View style={{ paddingTop: 15 }}>
            <Text style={[styles.text, { fontSize: 18 }]}>
              Calorias essa semana
            </Text>
            <View style={styles.progressContainer}>
              <Animated.View
                style={[styles.progressBarMeal, { width: caloriasWidth }]}
              />
            </View>
            {/* DADOS REAIS */}
            <Text style={styles.progressText}>
              {Math.round(
                progressData?.progresso_calorias?.consumido_semanal || 0
              )}{" "}
              /{" "}
              {Math.round(
                progressData?.progresso_calorias?.meta_consumo_semanal || 0
              )}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// --- Estilos (sem alteração) ---
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
  // Adicionado para envolver o conteúdo principal
  mainContent: {
    width: "100%",
    paddingHorizontal: 24, // Alinha com o resto do app
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