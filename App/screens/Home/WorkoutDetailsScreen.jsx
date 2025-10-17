import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import Topbar from "../../components/topbar/Topbar";

export const WorkoutDetailsScreen = ({ navigation }) => {
  const route = useRoute();
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <Topbar navigation={navigation} title="Detalhes do Treino" />

      <ScrollView contentContainerStyle={styles.body}>
        <Image source={{ uri: item.imageUri }} style={styles.image} />

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subInfo}>
          ⏱ {item.duration} • 🕖 {item.timeLabel}
        </Text>

        <Text style={styles.description}>{item.description}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  body: { padding: 20 },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: { color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  subInfo: { color: "#ccc", fontSize: 15, marginBottom: 12 },
  description: { color: "white", fontSize: 16, lineHeight: 22 },
});
