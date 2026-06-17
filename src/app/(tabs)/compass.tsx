import Compass from "@/components/Compass";
import { useAppContext } from "@/context/AppContext";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CompassScreen() {
  const { hasLocationPermission } = useAppContext();
  return (
    <SafeAreaView style={styles.container}>
      {!hasLocationPermission && (
        <Text style={styles.text}>
          Se requiere el permiso de ubicación para usar la brújula.
        </Text>
      )}
      <Compass hasLocationPermission={hasLocationPermission} />;
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
    marginVertical: 20,
    color: "#8e1818",
    backgroundColor: "#8e181818",
    padding: 10,
    borderRadius: 10,
  },
});
