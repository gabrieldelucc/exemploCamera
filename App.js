import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [tipoCamera, setTipoCamera] = useState(CameraType.back);
  const cameraRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();

      const { status: mediaStatus } =
        await MediaLibrary.requestCameraPermissionsAsync();
    })();
  }, []);

  async function CapturePhoto() {
    if (cameraRef) {
      const photo = await cameraRef.current.takePictureAsync();

      setPhoto(photo.uri);

      setOpenModal(true);
      console.log(photo);
    }
  }

  function ClearPhoto() {
    setPhoto(null);

    setOpenModal(false);
  }

  async function UploadPhoto() {
    await MediaLibrary.createAssetAsync(photo)
      .then(() => {
        alert("Foto salva com Sucesso");
      })
      .catch((error) => {
        alert("Não foi possível processar a foto");
      });
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        ratio="16:9"
        type={tipoCamera}
        ref={cameraRef}
      >
        <View style={styles.viewFlip}>
          <TouchableOpacity
            style={styles.btnFlip}
            onPress={() =>
              setTipoCamera(
                tipoCamera == CameraType.front
                  ? CameraType.back
                  : CameraType.front
              )
            }
          >
            <Text style={styles.txtFlip}>Trocar</Text>
          </TouchableOpacity>
        </View>
      </Camera>

      <TouchableOpacity
        style={styles.btnCapture}
        onPress={() => CapturePhoto()}
      >
        <FontAwesome name="camera" size={23} color="#fff" />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={false} visible={openModal}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            margin: 20,
          }}
        >
          <View style={{ margin: 10, flexDirection: "row", gap: 20 }}></View>
          <TouchableOpacity
            style={styles.btnClear}
            onPress={() => ClearPhoto()}
          >
            <FontAwesome name="trash" size={23} color="#ff000" />
          </TouchableOpacity>
          <Image
            source={{ uri: photo }}
            style={{ width: "100%", height: 500, borderRadius: 15 }}
          />
          <TouchableOpacity
            style={styles.btnUpload}
            onPress={() => UploadPhoto()}
          >
            <FontAwesome name="upload" size={23} color="#121212" />
          </TouchableOpacity>
      
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  camera: {
    flex: 1,
    height: "80%",
    width: "100%",
  },

  viewFlip: {
    flex: 1,
    backgroundColor: " transparent ",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  btnFlip: {
    padding: 20,
  },

  txtFlip: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
  },

  btnCapture: {
    padding: 20,
    borderRadius: 10,
    margin: 20,
    backgroundColor: "#121212",

    justifyContent: "center",
    alignItems: "center",
  },
  btnClear: {
    padding: 20,

    backgroundColor: "transparent",

    justifyContent: "center",
    alignItems: "center",
  },
  btnUpload: {
    padding: 20,

    backgroundColor: "transparent",

    justifyContent: "center",
    alignItems: "center",
  },
});
