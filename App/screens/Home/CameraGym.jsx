import { useEffect, useRef, useState } from "react";
import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";

import CloseIcon from "../../../assets/icons/arrowBack.svg";
import ShotIcon from "../../../assets/icons/shot.svg";
import Ionicons from "@expo/vector-icons/Ionicons";
import GalleryIcon from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";

export const CameraScreen = ({ navigation }) => {


  const [cameraRef, setCameraRef] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [flash, setFlash] = useState("off");
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);

  const [loading, setLoading] = useState(false);
  const onCameraReady = () => setIsCameraReady(true);

  const takePicture = async () => {
    if (isCameraReady && cameraRef) {
      try {
        const data = await cameraRef.takePictureAsync({ quality: 1, shutterSound: false });
        console.log("image uri", data.uri)
        setImageUri(data.uri);

      } catch (error) {
        console.log(error)
      }
    }
  };

  const pickImage = async () => {
    const { assets } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    const { uri } = assets[0];

    setImageUri(uri);
  };

  useEffect(() => {
    if (!imageUri) return;

    navigation.navigate("NewWorkout", { imageUri });
    setLoading(false);
  }, [imageUri]);

  const toggleFlash = () => {
    setFlash((prevFlash) => (prevFlash === "off" ? "on" : "off"));
  };

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        flash="on"
        ref={(ref) => setCameraRef(ref)}
        onCameraReady={onCameraReady}
        active={true}
      >
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.gallery} onPress={pickImage}>
            <GalleryIcon name="images-outline" size={30} color="white" />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: 'center' }}>
            {/* <Animated.View style={{ transform: [{ scale: scaleAnim }] }}> */}
            <TouchableOpacity
              onPress={takePicture}
            >
              <ShotIcon />
            </TouchableOpacity>
            {/* </Animated.View> */}
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

      {/* {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#50685B" />
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
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

  shot: {
    width: 68,
    height: 68,
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 50,
    backgroundColor: "#fff",
  },

  flash: {
    height: 40,
    width: 40,
    alignSelf: "center",
    justifyContent: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  gallery: {
    justifyContent: "center",
  },
});
