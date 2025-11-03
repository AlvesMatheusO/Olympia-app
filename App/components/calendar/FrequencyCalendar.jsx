import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

LocaleConfig.locales["pt-br"] = {
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

export default function FrequencyCalendar() {
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);


  const mockData = useMemo(
    () => ({
      "2025-11-01": { treinos: [{ tipo: "Perna" }] },
      "2025-11-03": { treinos: [{ tipo: "Peito" }] },
      "2025-11-05": { treinos: [{ tipo: "Costas" }] },
      "2025-11-07": { treinos: [{ tipo: "Ombro" }] },
      "2025-11-10": { treinos: [{ tipo: "HIIT" }] },
    }),
    []
  );

  useEffect(() => {
    if (!mockData || Object.keys(mockData).length === 0) {
      setMarkedDates({});
      setLoading(false);
      return;
    }

    const marks = {};
    Object.keys(mockData).forEach((date) => {
      const { treinos = [] } = mockData[date];

      if (treinos.length > 0) {
        marks[date] = {
          customStyles: {
            container: {
              borderWidth: 2,
              borderColor: "#32CD32",
              backgroundColor: "transparent",
              borderRadius: 20,
            },
            text: {
              color: "#FFFFFF",
              fontWeight: "bold",
            },
          },
        };
      }
    });

    setTimeout(() => {
      setMarkedDates(marks);
      setLoading(false);
    }, 400);
  }, [mockData]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <ActivityIndicator size="large" color="#32CD32" />
        <Text style={{ color: "#fff", marginTop: 10 }}>
          Carregando calendário...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: "#121212", padding: 16, borderRadius: 12 }}>
      <Text
        style={{
          color: "#fff",
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 12,
          alignSelf: "center",
        }}
      >
        Frequência de Treinos
      </Text>

      <Calendar
        markingType="custom"
        markedDates={markedDates}
        theme={{
          backgroundColor: "#121212",
          calendarBackground: "#121212",
          dayTextColor: "#fff",
          monthTextColor: "#fff",
          arrowColor: "#32CD32",
          todayTextColor: "#32CD32",
          textSectionTitleColor: "#888",
        }}
        enableSwipeMonths
        onDayPress={(day) => console.log("Dia selecionado:", day.dateString)}
      />

      <View
        style={{
          marginTop: 16,
          alignItems: "center",
          gap: 4,
        }}
      >
        <Text style={{ color: "#32CD32" }}>🟢 — Dia com treino (check-in)</Text>
      </View>
    </View>
  );
}
