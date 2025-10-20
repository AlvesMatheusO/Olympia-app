import { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ThemeContext } from "../../../contexts/ui/ThemeContext";
import { lightTheme, darkTheme } from "../../theme/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

// 1. Importar o hook de autenticação
import { useAuth } from "../../../contexts/auth/AuthContext"; // (Ajuste o caminho se necessário)

import AddRecordBtn from "../../components/button/AddRecordBtn";
import MealCard from "../../components/card/MealCard";
import WorkoutCard from "../../components/card/WorkoutCard";

const API_URL = "https://tqqtsjl1-8000.brs.devtunnels.ms/api/feed/";

// Adicione a prop 'navigation' se estiver usando TypeScript
// (ex: export const HomeScreen = ({ navigation }: { navigation: any }) => {)
export const HomeScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const currentTheme = theme === "light" ? lightTheme : darkTheme;
  const tabBarHeight = useBottomTabBarHeight();

  // Estados para dados, loading e erro
  const [feedData, setFeedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Pegar o token e a função signOut do AuthContext
  const { accessToken, signOut } = useAuth();

  // 3. useEffect para buscar os dados quando o componente montar
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        // 4. Criar as opções da requisição com o token
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Adiciona o token no header
            'Authorization': `Bearer ${accessToken}`
          }
        };

        // 5. Fazer a requisição com as opções
        const response = await fetch(API_URL, options);

        // 6. Tratar resposta não autorizada (token expirado/inválido)
        if (!response.ok) {
          if (response.status === 401) {
            // Token inválido ou expirado. Deslogar o usuário.
            signOut(); // Chama a função do AuthContext
            throw new Error("Sessão expirada. Faça login novamente.");
          }
          throw new Error("A resposta da rede não foi 'ok'");
        }

        const data = await response.json();
        console.log("Dados do feed:", data);

        // 7. NORMALIZAR OS DADOS (A "TRADUÇÃO")
        const normalizedData = data.results.map((item) => {
          // A API usa 'tipo' para um e 'tipo_feed' para outro
          const type = item.tipo || item.tipo_feed;
          
          return {
            // Prop do Componente: Valor da API
            id: item.id,
            type: type,
            title: item.titulo,
            description: item.descricao,
            imageUri: item.url_completa, // Traduz 'url_completa' para 'imageUri'
            calories: item.calorias || "N/A", // API já fornece
            
            // Tenta pegar o 'horario', se não, usa a 'data'
            timeLabel: item.data || "N/A", 
            
            // A API não fornece 'duration' para treinos, então adicionamos um fallback
            duration: item.duracao || "N/A", 
          };
        });

        setFeedData(normalizedData);
      } catch (e) {
        console.error("Erro ao buscar dados:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Só executa o fetch se houver um token
    if (accessToken) {
      fetchFeed();
    } else {
      // Se por algum motivo não houver token, não carregar e deslogar
      setIsLoading(false);
      if(signOut) signOut();
    }

    // O useEffect depende do 'accessToken' e 'signOut'
  }, [accessToken, signOut]); 

  // 8. FUNÇÃO HELPER PARA RENDERIZAR O CONTEÚDO
  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#d53535ff" style={{ marginTop: 40 }} />;
    }

    if (error) {
      return (
        <Text style={{ color: "#888", textAlign: "center", marginTop: 40, paddingHorizontal: 20 }}>
          {error}
        </Text>
      );
    }

    if (feedData.length > 0) {
      return feedData.map((item) => {
        const targetRoute =
          item.type === "treino" ? "WorkoutDetails" : "MealDetails";
        const CardComponent =
          item.type === "treino" ? WorkoutCard : MealCard;

        return (
          <CardComponent
            key={`${item.type}-${item.id}`} // Chave mais forte
            {...item}
            onPress={() => navigation.navigate(targetRoute, { item })}
          />
        );
      });
    }

    return (
      <Text style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
        Nenhum treino ou refeição registrada ainda.
      </Text>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
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
          />
          <View style={styles.titleWrapper}>
            <Text style={styles.topbarTitle}>Olympia</Text>
          </View>
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {renderContent()}
      </ScrollView>

      <AddRecordBtn
        actions={[
          {
            label: "Adicionar Treino",
            icon: "barbell-outline",
            route: "Camera",
            params: { type: "treino" },
          },
          {
            label: "Adicionar Refeição",
            icon: "restaurant-outline",
            route: "Camera",
            params: { type: "refeicao" },
          },
        ]}
        bottomOffset={tabBarHeight + 24}
        rightOffset={24}
        color="#d53535ff"
        tintLabel="#FFF"
      />
    </View>
  );
};

// Seus estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topbar: {
    padding: 24,
    paddingTop: "15%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
  },
  body: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  titleWrapper: {
    flex: 1,
  },
  topbarTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});