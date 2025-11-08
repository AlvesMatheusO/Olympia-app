import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ThemeContext } from "../../../contexts/ui/ThemeContext";
import { lightTheme, darkTheme } from "../../theme/theme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useAuth } from "../../../contexts/auth/AuthContext";
import MealCard from "../../components/card/MealCard";
import AddRecordBtn from "../../components/button/AddRecordBtn";

const API_URL = "https://tqqtsjl1-8000.brs.devtunnels.ms/api/feed/";

export const MealTabScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === "light" ? lightTheme : darkTheme;
  const tabBarHeight = useBottomTabBarHeight();
  const { accessToken, signOut } = useAuth();

  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("geral"); // 👈 começa no modo geral

  useEffect(() => {
    const fetchMeals = async () => {
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

        const normalizedData = data.results
          .map((item) => {
            const type = item.tipo || item.tipo_feed;
            return {
              id: item.id,
              type,
              title: item.titulo,
              description: item.descricao,
              imageUri: item.url_completa,
              calories: item.calorias || 0,
              subtype: item.subtipo?.toLowerCase() || "",
              timeLabel: item.data || "N/A",
            };
          })
          .filter((item) => item.type?.toLowerCase() === "refeicao");

        setMeals(normalizedData);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchMeals();
    } else {
      setIsLoading(false);
      signOut?.();
    }
  }, [accessToken, signOut]);

  // 🔍 Filtragem dinâmica (agora com "geral")
  const filteredMeals =
    selectedPeriod === "geral"
      ? meals // mostra tudo
      : meals.filter((m) => m.subtype?.includes(selectedPeriod));

  const totalCalories = filteredMeals.reduce(
    (sum, meal) => sum + Number(meal.calories || 0),
    0
  );

  const renderContent = () => {
    if (isLoading)
      return (
        <ActivityIndicator
          size="large"
          color="#4ade80"
          style={{ marginTop: 40 }}
        />
      );

    if (error)
      return (
        <Text style={styles.errorText}>
          {error || "Erro ao carregar refeições."}
        </Text>
      );

    if (filteredMeals.length === 0)
      return (
        <Text style={styles.emptyText}>
          Nenhuma refeição registrada para este período.
        </Text>
      );

    return filteredMeals.map((meal) => (
      <MealCard
        key={meal.id}
        {...meal}
        onPress={() => navigation.navigate("MealDetails", { meal })}
      />
    ));
  };

  // 🧭 Botões de filtro
  const periods = [
    { label: "Geral", key: "geral" },
    { label: "Café", key: "café" },
    { label: "Almoço", key: "almoço" },
    { label: "Jantar", key: "jantar" },
    { label: "Lanches", key: "lanche" },
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      {/* Botões de seleção */}
      <View style={styles.filterRow}>
        {periods.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[
              styles.filterButton,
              selectedPeriod === p.key && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedPeriod(p.key)}
          >
            <Text
              style={[
                styles.filterText,
                selectedPeriod === p.key && styles.filterTextActive,
              ]}
            >
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerCard}>
          <Text style={styles.calorieNumber}>{totalCalories}</Text>
          <Text style={styles.calorieLabel}>
            {selectedPeriod === "geral"
              ? "Calorias totais consumidas hoje"
              : `Calorias no ${selectedPeriod}`}
          </Text>
        </View>
        {renderContent()}
      </ScrollView>

      <AddRecordBtn
        actions={[
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 60,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#1a1f2e",
    marginVertical: 4,
  },
  filterButtonActive: {
    backgroundColor: "#4ade80",
  },
  filterText: {
    color: "#ccc",
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },
  headerCard: {
    backgroundColor: "#1a3a2e",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2d5a4a",
  },
  calorieNumber: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#4ade80",
    marginBottom: 4,
  },
  calorieLabel: {
    fontSize: 14,
    color: "#86efac",
    fontWeight: "600",
  },
  errorText: {
    color: "#f87171",
    textAlign: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 40,
  },
});
