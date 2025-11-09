import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ThemeContext } from "../../../contexts/ui/ThemeContext";
import { lightTheme, darkTheme } from "../../theme/theme";
import AddRecordBtn from "../../components/button/AddRecordBtn";
import WeekCalendar from "../../components/calendar/WeekCalendar";
import WorkoutCard from "../../components/card/WorkoutCard";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useAuth, API_BASE_URL } from "../../../contexts/auth/AuthContext";

export const WorkoutScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === "light" ? lightTheme : darkTheme;
  const tabBarHeight = useBottomTabBarHeight();
  const { accessToken, signOut } = useAuth();

  const [feedData, setFeedData] = useState([]);
  // 1. Adicionar novo estado para os dias da semana
  const [trainedDays, setTrainedDays] = useState([]); 
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 2. Renomear a função para refletir que ela busca todos os dados da tela
    const fetchScreenData = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };

        // 3. Preparar as duas chamadas de API
        const feedPromise = fetch(`${API_BASE_URL}api/feed/workouts/`, options);
        
        // ❗ ATENÇÃO: Confirme se esta é a URL correta do seu endpoint no urls.py
        const calendarPromise = fetch(`${API_BASE_URL}api/calendar/weekly/`, options);

        // 4. Executar as duas requisições em paralelo
        const [feedResponse, calendarResponse] = await Promise.all([
          feedPromise,
          calendarPromise,
        ]);

        // --- Processamento do Feed (Lógica existente) ---
        if (!feedResponse.ok) {
          if (feedResponse.status === 401) {
            signOut();
            throw new Error("Sessão expirada. Faça login novamente.");
          }
          throw new Error("Erro ao buscar dados do feed.");
        }
        
        const feedJson = await feedResponse.json();
        const normalizedData = feedJson.results
          .map((item) => {
            const type = item.tipo || item.tipo_feed;
            return {
              id: item.id,
              type,
              title: item.titulo,
              description: item.descricao,
              imageUri: item.url_completa,
              calories: item.calorias || "N/A",
              timeLabel: item.data || "N/A",
              duration: item.duracao || "N/A",
            };
          })
          .filter((item) => item.type?.toLowerCase() === "treino");

        setFeedData(normalizedData);

        // --- Processamento do Calendário (Nova lógica) ---
        if (!calendarResponse.ok) {
           // Se o feed falhou, já teremos saído no 'throw' acima
           // Mas se só o calendário falhar (ex: 401), deslogamos também
          if (calendarResponse.status === 401) {
            signOut();
            throw new Error("Sessão expirada. Faça login novamente.");
          }
          // Se não for 401, apenas logamos o erro, mas a tela pode continuar
          console.error("Erro ao buscar dados do calendário.");
          // Lançar erro aqui opcionalmente, se o calendário for crítico
          // throw new Error("Erro ao buscar dados do calendário.");
        } else {
            const calendarData = await calendarResponse.json();
            // A API já retorna ["Seg", "Qua", "Sex"], então é só salvar
            setTrainedDays(calendarData);
        }

      } catch (e) {
        console.error("Erro ao buscar dados:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchScreenData(); // 5. Chamar a função atualizada
    } else {
      setIsLoading(false);
      if (signOut) signOut();
    }
  }, [accessToken, signOut]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color="#d53535ff"
          style={{ marginTop: 40 }}
        />
      );
    }

    if (error) {
      return (
        <Text
          style={{
            color: "#888",
            textAlign: "center",
            marginTop: 40,
            paddingHorizontal: 20,
          }}
        >
          {error}
        </Text>
      );
    }

    if (feedData.length > 0) {
      return feedData.map((item) => (
        <WorkoutCard
          key={`treino-${item.id}`}
          {...item}
          onPress={() => navigation.navigate("WorkoutDetails", { item })}
        />
      ));
    }

    return (
      <Text style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
        Nenhum treino registrado ainda.
      </Text>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 6. Passar o estado dinâmico para o componente */}
        <WeekCalendar checkedDays={trainedDays} />
        
        <View style={styles.header}>
          <Text style={styles.title}>Seu treino de hoje!</Text>
        </View>

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
        ]}
        bottomOffset={tabBarHeight + 24}
        rightOffset={24}
        color="#d53535ff"
        tintLabel="#FFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 120,
  },
  header: {
    paddingTop: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    color: "#FFF",
    paddingBottom: 15,
  },
});