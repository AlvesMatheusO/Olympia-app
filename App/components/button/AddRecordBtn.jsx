import React, { useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function AddRecordBtn({
  actions = [
    { label: "Home", icon: "home", route: "HomeScreen" },
    { label: "Ajustes", icon: "settings", route: "SettingsScreen" },
  ],
  bottomOffset = 96,
  rightOffset = 24,
  color = "#B22222",
  tintLabel = "#111827",
  itemBg = "#ffbf00ff",
}) {
  const nav = useNavigation();
  const [open, setOpen] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  const animatedRotate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const toggleMenu = () => {
    const toValue = open ? 0 : 1;
    setOpen(!open);

    Animated.parallel([
      Animated.timing(opacity, { toValue, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(scale, { toValue: open ? 0.95 : 1, speed: 16, bounciness: 6, useNativeDriver: true }),
      Animated.timing(rotate, { toValue, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  };

  const handleNavigate = (a) => {
    // fecha o menu e navega
    setOpen(false);
    opacity.setValue(0);
    rotate.setValue(0);
    scale.setValue(0.95);
    nav.navigate(a.route, a.params);
  };

  const items = useMemo(
    () =>
      actions.map((a, idx) => (
        <Pressable
          key={`${a.route}-${idx}`}
          onPress={() => handleNavigate(a)}
          style={({ pressed }) => [
            styles.item,
            { backgroundColor: itemBg },
            pressed && { opacity: 0.85 },
          ]}
        >
          <Ionicons name={a.icon} size={18} color={tintLabel} />
          <Text style={[styles.itemLabel, { color: tintLabel }]}>{a.label}</Text>
        </Pressable>
      )),
    [actions, itemBg, tintLabel]
  );

  return (
    <>
      {/* Overlay para fechar ao tocar fora */}
      {open && <Pressable style={StyleSheet.absoluteFill} onPress={toggleMenu} />}

      <View
        pointerEvents="box-none"
        style={[styles.container, { bottom: bottomOffset, right: rightOffset }]}
      >
        {/* Menu */}
        <Animated.View
          style={[styles.menu, { opacity, transform: [{ scale }] }]}
          pointerEvents={open ? "auto" : "none"}
        >
          {items}
        </Animated.View>

        {/* Botão principal */}
        <Pressable
          onPress={toggleMenu}
          style={({ pressed }) => [styles.fab, { backgroundColor: color }, pressed && { transform: [{ scale: 0.98 }] }]}
          android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: true }}
        >
          <Animated.View style={{ transform: [{ rotate: animatedRotate }] }}>
            <Ionicons name="camera-outline" size={26} color="#fff" />
          </Animated.View>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "flex-end",
    zIndex: 50,
  },
  menu: {
    marginBottom: 12,
    gap: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    // sombra iOS
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    // elevação Android
    elevation: 4,
  },
  itemLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    // sombra iOS
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    // elevação Android
    elevation: 6,
  },
});
