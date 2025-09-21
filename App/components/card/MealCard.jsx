import React from "react";
import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MealCard({
  title = "Greek Yogurt & Berries",
  calories = 180,
  timeLabel = "2:05 PM",
  description = "Plain Greek yogurt topped with mixed berries and a drizzle of honey.",
  imageUri = "https://images.unsplash.com/photo-1551024709-8f23befc6cf7?q=80&w=1200&auto=format&fit=crop",
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.cardShadow, pressed && { opacity: 0.95 }]}
      android_ripple={{ color: "rgba(255,255,255,0.05)" }}
    >
      <View style={styles.card}>
        {/* Imagem + chip de horário */}
        <View style={styles.imageWrap}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <LinearGradient
            colors={["#FF3B30", "#B22222"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.timeChip}
          >
            <Ionicons name="time-outline" size={12} color="#fff" />
            <Text style={styles.timeText}>{timeLabel}</Text>
          </LinearGradient>
        </View>

        {/* Área escura com infos */}
        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.caloriePill}>
              <Text style={styles.calorieText}>{calories} cal</Text>
            </View>
          </View>

          <Text style={styles.desc} numberOfLines={2}>
            {description}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const RADIUS = 16;

const styles = StyleSheet.create({
  cardShadow: {
    marginHorizontal: 16,
    marginVertical: 10,
    // sombra iOS
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    // elevação Android
    elevation: 8,
    borderRadius: RADIUS,
  },
  card: {
    borderRadius: RADIUS,
    overflow: "hidden",
    backgroundColor: "#0F172A", // fallback sob a imagem
  },
  imageWrap: {
    position: "relative",
    backgroundColor: "#111827",
  },
  image: {
    width: "100%",
    height: 140,
  },
  timeChip: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  info: {
    backgroundColor: "#1a3b21ff", // escuro estilo da imagem (#0f172a/slate-900 vibe)
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  caloriePill: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.18)",
  },
  calorieText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  desc: {
    marginTop: 6,
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    lineHeight: 18,
  },
});
