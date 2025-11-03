import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet, Text } from "react-native";

export default function ProgressBar({ progress }) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 800, // duração da animação
      useNativeDriver: false, // false pois estamos animando largura (layout)
    }).start();
  }, [progress]);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, { width: animatedWidth }]} />
      <Text style={styles.label}>{Math.round(progress * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 20,
    width: "80%",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
    justifyContent: "center",
  },
  bar: {
    height: "100%",
    backgroundColor: "#76c7c0",
  },
  label: {
    position: "absolute",
    alignSelf: "center",
    color: "#000",
    fontWeight: "bold",
  },
});
