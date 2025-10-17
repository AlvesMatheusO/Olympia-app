import { useEffect, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

import CloseIcon from "../../../assets/icons/arrowBack.svg";
import ShotIcon from "../../../assets/icons/shot.svg";

export const CameraScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type } = route.params || {};
  const [cameraRef, setCameraRef] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [flash, setFlash] = useState("off");
  const [permission, requestPermission] = useCameraPermissions();

  const onCameraReady = () => setIsCameraReady(true);

  const takePicture = async () => {
    if (isCameraReady && cameraRef) {
      try {
        const data = await cameraRef.takePictureAsync({
          quality: 1,
          shutterSound: false,
        });

        console.log("📸 image uri:", data.uri);

        if (type === "treino") {
          navigation.navigate("NewWorkout", { imageUri: data.uri });
        } else if (type === "refeicao") {
          navigation.navigate("NewMeal", { imageUri: data.uri });
        } else {
          console.warn("Tipo de registro não reconhecido.");
        }
      } catch (error) {
        console.log("Erro ao capturar:", error);
      }
    }
  };

  const pickImage = async () => {
    const { assets } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!assets || !assets.length) return;
    const { uri } = assets[0]; 

    console.log("🖼️ Imagem da galeria:", uri);

    if (type === "treino") {
      navigation.navigate("NewWorkout", { imageUri: uri }); 
    } else if (type === "refeicao") {
      navigation.navigate("NewMeal", { imageUri: uri }); 
    } else {
      console.warn("Tipo de registro não reconhecido.");
    }
  };

  const toggleFlash = () => {
    setFlash((prev) => (prev === "off" ? "on" : "off"));
  };

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) return <View />;

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        flash={flash}
        ref={(ref) => setCameraRef(ref)}
        onCameraReady={onCameraReady}
        active
      >
        {/* Botão fechar */}
        <View style={styles.closebtn}>
          <TouchableOpacity
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
              })
            }
          >
            <CloseIcon />
          </TouchableOpacity>
        </View>

        {/* Controles */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.gallery} onPress={pickImage}>
            <Ionicons name="images-outline" size={30} color="white" />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: "center" }}>
            <TouchableOpacity onPress={takePicture}>
              <ShotIcon />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.flash} onPress={toggleFlash}>
            <Ionicons
              name={flash === "off" ? "flash-off-outline" : "flash-outline"}
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closebtn: {
    alignItems: "flex-start",
    paddingLeft: 24,
    paddingTop: "10%",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    height: 124,
    bottom: 0,
    position: "absolute",
    justifyContent: "space-between",
    paddingVertical: 28,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF1A",
  },
  flash: {
    height: 40,
    width: 40,
    alignSelf: "center",
    justifyContent: "center",
  },
  gallery: {
    justifyContent: "center",
  },
});
