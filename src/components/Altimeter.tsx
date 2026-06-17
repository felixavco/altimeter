import * as Location from "expo-location";
import { type EventSubscription } from "expo-modules-core";
import { Barometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ReloadIcon } from "./icons/ReloadIcon";
import { SpinAnimation } from "./SpinAnimation";

interface AltimeterProps {
  hasLocationPermission: boolean | null;
}

const DEFAULT_PRESSURE = 1013.25;
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export function Altimeter({ hasLocationPermission }: AltimeterProps) {
  const [P0, setP0] = useState(DEFAULT_PRESSURE);
  const [GPSAltitude, setGPSAltitude] = useState<number | null>(null);
  const [currentPressure, setCurrentPressure] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const barometerSub = useRef<EventSubscription | null>(null);

  const getPressureMSL = async (long: number, lat: number) => {
    try {
      const params = new URLSearchParams();
      params.set("latitude", lat.toString());
      params.set("longitude", long.toString());
      params.set("current", "pressure_msl");

      const response = await fetch(`${WEATHER_API_URL}?${params.toString()}`);
      const data = await response.json();
      return data.current.pressure_msl as number;
    } catch (error) {
      console.error("Error fetching pressure from Open-Meteo API:", error);
    }
  };

  const calibrateWithGPS = async () => {
    if (hasLocationPermission) {
      setIsLoading(true);
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });

        const { longitude, latitude, altitude } = location.coords;
        setGPSAltitude(altitude);
        const pressureMSL = await getPressureMSL(longitude, latitude);
        if (typeof pressureMSL === "number") {
          setP0(pressureMSL);
        }
      } catch (error) {
        console.error("Error fetching GPS data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const startBarometer = async () => {
      const isAvailable = await Barometer.isAvailableAsync();
      if (isAvailable) {
        Barometer.setUpdateInterval(1000);
        barometerSub.current = Barometer.addListener((data) => {
          setCurrentPressure(data.pressure);
        });
      }
    };

    startBarometer();
    calibrateWithGPS();

    return () => {
      if (barometerSub.current) {
        barometerSub.current.remove();
      }
    };
  }, []);

  const calculateCurrentAltitude = () => {
    if (P0 === null || currentPressure === null) {
      return null;
    }
    // Formula: Δh = 44330 * (P_current / P0)^(1/5.255)
    const exp = 1 / 5.255;
    const altitude = 44330 * (1 - Math.pow(currentPressure / P0, exp));
    return altitude.toFixed(1);
  };

  const currentAltitude = calculateCurrentAltitude();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={calibrateWithGPS}
          style={styles.reloadButton}
          disabled={isLoading || currentPressure === null}
        >
          <SpinAnimation isSpinning={isLoading}>
            <ReloadIcon color="#007AFF" />
          </SpinAnimation>
        </Pressable>
      </View>

      <Text style={styles.title}>Altímetro</Text>

      {isLoading ? (
        <Text style={styles.loadingText}>Calibrando...</Text>
      ) : (
        <Text style={styles.altitudeText}>
          {currentAltitude !== null
            ? `${currentAltitude} metros`
            : "No calibrado"}
        </Text>
      )}

      <Text style={styles.text}>
        Presión actual:{" "}
        {currentPressure !== null
          ? `${currentPressure.toFixed(2)} hPa`
          : "Leyendo..."}
      </Text>
      <Text style={styles.text}>
        Altitud Ref (GPS):{" "}
        {GPSAltitude !== null && !isLoading
          ? `${GPSAltitude.toFixed(1)} m`
          : "--"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  altitudeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
  },
  loadingText: {
    marginVertical: 5,
    fontSize: 25,
    fontWeight: "bold",
    color: "#007bff8e",
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  buttonContainer: {
    marginBottom: 10,
    width: "100%",
    alignItems: "flex-end",
  },
  reloadButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
});
