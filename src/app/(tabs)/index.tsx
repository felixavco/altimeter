import { Altimeter } from "@/components/Altimeter";
import { useAppContext } from "@/context/AppContext";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const { hasLocationPermission } = useAppContext();

  if (hasLocationPermission === false) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Solicitando permisos de ubicación...</Text>
      </View>
    );
  }

  if (
    hasLocationPermission === null ||
    (typeof hasLocationPermission === "boolean" && !hasLocationPermission)
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Se requiere el permiso de ubicación para usar los instrumentos.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Altimeter hasLocationPermission={hasLocationPermission} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});
