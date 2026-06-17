import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface CompassProps {
  hasLocationPermission: boolean | null;
}

export default function Compass({ hasLocationPermission }: CompassProps) {
  const [heading, setHeading] = useState<number>(0);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startCompass = async () => {
      if (hasLocationPermission) {
        try {
          subscription = await Location.watchHeadingAsync((data) => {
            // trueHeading can be -1 if it can't be determined (e.g. no GPS or calibration issues)
            const currentHeading =
              data.trueHeading !== -1 ? data.trueHeading : data.magHeading;
            setHeading(currentHeading);
          });
        } catch (error) {
          console.error("Error initializing Compass:", error);
        }
      }
    };

    startCompass();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [hasLocationPermission]);

  const getCardinalDirection = (degree: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    const index = Math.round((degree % 360) / 45);
    return directions[index];
  };

  const currentDirection = getCardinalDirection(heading);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brújula</Text>

      <View style={styles.compassContainer}>
        <View style={styles.dial}>
          <Text style={[styles.cardinalText, styles.northText]}>N</Text>
          <Text style={[styles.cardinalText, styles.eastText]}>E</Text>
          <Text style={[styles.cardinalText, styles.southText]}>S</Text>
          <Text style={[styles.cardinalText, styles.westText]}>W</Text>

          <Animated.View
            style={[
              styles.needleContainer,
              { transform: [{ rotate: `${-heading}deg` }] },
            ]}
          >
            <View style={styles.northNeedle} />
            <View style={styles.southNeedle} />
          </Animated.View>
        </View>
      </View>

      <Text style={styles.degreeText}>
        {Math.round(heading)}° {currentDirection}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  compassContainer: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  dial: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: "#333",
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cardinalText: {
    position: "absolute",
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
    zIndex: 1,
  },
  northText: { top: 10 },
  southText: { bottom: 10 },
  eastText: { right: 15 },
  westText: { left: 15 },
  needleContainer: {
    width: 20,
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 10,
  },
  northNeedle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 65,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#FF3B30",
  },
  southNeedle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 65,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#A9A9A9",
  },
  degreeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 20,
  },
});
