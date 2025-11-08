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
import { useAuth } from "../../../contexts/auth/AuthContext";

const API_URL = "https://tqqtsjl1-8000.brs.devtunnels.ms/api/feed/";

export const WorkoutScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === "light" ? lightTheme : darkTheme;
  const tabBarHeight = useBottomTabBarHeight();
  const { accessToken, signOut } = useAuth();

  const [feedData, setFeedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await fetch(API_URL, options);

        if (!response.ok) {
          if (response.status === 401) {
            signOut();
            throw new Error("Sessão expirada. Faça login novamente.");
          }
          throw new Error("Erro ao buscar dados do feed.");
        }

        const data = await response.json();

        // Normaliza os dados e filtra apenas treinos
        const normalizedData = data.results
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
          .filter((item) => item.type?.toLowerCase() === "treino"); // 🔥 filtro só treinos

        setFeedData(normalizedData);
      } catch (e) {
        console.error("Erro ao buscar dados:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchFeed();
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
        <WeekCalendar checkedDays={["Seg", "Qua", "Sex"]} />
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
