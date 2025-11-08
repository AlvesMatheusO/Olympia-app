import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

// Importar o Contexto de Auth para o token e a URL
import { useAuth, API_BASE_URL } from "../../../contexts/auth/AuthContext";

// --- Configuração de Localização (Já estava ok) ---
LocaleConfig.locales["pt-br"] = {
  // ... (meses e dias)
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  dayNames: [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

// --- Definição das Cores ---
const MEAL_COLOR = "#32CD32"; // Verde (Refeição)
const WORKOUT_COLOR = "#B22222"; // Vermelho (Treino)

// --- REMOVIDA A FUNÇÃO formatISODate (não é mais necessária aqui) ---

export default function FrequencyCalendar() {
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);

  // --- REMOVIDO o estado 'currentMonthStr' ---
  // const [currentMonthStr, setCurrentMonthStr] = useState(...);

  const { accessToken } = useAuth(); // Pegar o token

  // --- Função para buscar os dados (NÃO recebe mais 'dateString') ---
  const fetchMarkedDates = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);

    // --- REMOVIDA a lógica de 'year' e 'month' ---

    try {
      // --- URL ATUALIZADA (sem query params) ---
      const response = await fetch(
        `${API_BASE_URL}api/calendar/markings/`, // <-- URL limpa
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao buscar dados do calendário");
      }

      const data = await response.json();
      setMarkedDates(data); // Salva TODOS os marcadores
    } catch (error) {
      console.error("Erro no fetchMarkedDates:", error);
      setMarkedDates({});
    } finally {
      setLoading(false);
    }
  }, [accessToken]); // Depende apenas do accessToken

  // --- Efeito Inicial ---
  // Busca os dados APENAS UMA VEZ
  useEffect(() => {
    fetchMarkedDates();
  }, [fetchMarkedDates]); // <-- Dependência 'currentMonthStr' REMOVIDA

  // --- REMOVIDO o handler 'handleMonthChange' ---

  // --- Renderização do Loading ---
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={MEAL_COLOR} />
        <Text style={styles.loadingText}>Carregando calendário...</Text>
      </View>
    );
  }

  // --- Renderização do Calendário ---
  return (
    <View style={styles.calendarContainer}>
      <Text style={styles.title}>Frequência de Atividades</Text>

      <Calendar
        markingType="multi-dot"
        markedDates={markedDates} // Passa todos os marcadores de uma vez
        theme={calendarTheme}
        enableSwipeMonths
        onDayPress={(day) => console.log("Dia selecionado:", day.dateString)}
        // --- REMOVIDO o 'onMonthChange' ---
      />

      {/* --- Legenda (sem alterações) --- */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: MEAL_COLOR }]} />
          <Text style={styles.legendText}>Refeição Registrada</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: WORKOUT_COLOR }]} />
          <Text style={styles.legendText}>Treino Registrado</Text>
        </View>
      </View>
    </View>
  );
}

// --- Estilos (sem alterações) ---
const calendarTheme = {
  backgroundColor: "#121212",
  calendarBackground: "#121212",
  dayTextColor: "#fff",
  monthTextColor: "#fff",
  arrowColor: MEAL_COLOR,
  todayTextColor: MEAL_COLOR,
  textSectionTitleColor: "#888",
  textDisabledColor: "#444",
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    borderRadius: 12,
    padding: 20,
    minHeight: 300,
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
  },
  calendarContainer: {
    backgroundColor: "#121212",
    padding: 16,
    borderRadius: 12,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    alignSelf: "center",
  },
  legendContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    color: "#fff",
    fontSize: 12,
  },
});