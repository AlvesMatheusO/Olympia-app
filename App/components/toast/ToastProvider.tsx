import React from "react";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Text } from "react-native";

export function ToastProvider() {
  return (
    <Toast
      config={{
        success: (props) => (
          <BaseToast
            {...props}
            style={{ borderLeftColor: "#22c55e" }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
              fontSize: 16,
              fontWeight: "600",
            }}
            text2Style={{
              fontSize: 14,
              color: "#374151",
            }}
          />
        ),
        error: (props) => (
          <ErrorToast
            {...props}
            style={{ borderLeftColor: "#ef4444" }}
            text1Style={{
              fontSize: 16,
              fontWeight: "600",
            }}
            text2Style={{
              fontSize: 14,
              color: "#374151",
            }}
          />
        ),
        info: (props) => (
          <BaseToast
            {...props}
            style={{ borderLeftColor: "#3b82f6" }}
            text1Style={{
              fontSize: 16,
              fontWeight: "600",
            }}
          />
        ),
      }}
    />
  );
}
