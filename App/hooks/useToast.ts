import Toast from "react-native-toast-message";

export function useToast() {
  const showSuccess = (message: string, description?: string) => {
    Toast.show({
      type: "success",
      text1: message,
      text2: description,
      position: "bottom",
      visibilityTime: 3000,
    });
  };

  const showError = (message: string, description?: string) => {
    Toast.show({
      type: "error",
      text1: message,
      text2: description,
      position: "bottom",
      visibilityTime: 4000,
    });
  };

  const showInfo = (message: string, description?: string) => {
    Toast.show({
      type: "info",
      text1: message,
      text2: description,
      position: "bottom",
      visibilityTime: 3000,
    });
  };

  return { showSuccess, showError, showInfo };
}
