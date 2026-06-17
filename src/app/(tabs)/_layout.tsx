import { CompassIcon } from "@/components/icons/CompassIcon";
import { GaugeIcon } from "@/components/icons/GaugeIcon";
import AppContextProvider from "@/context/AppContext";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AppContextProvider>
      <StatusBar style="dark" />
      <Tabs>
        <Tabs.Screen
          name="compass"
          options={{
            title: "Brújula",
            headerShown: false,
            tabBarIcon: ({ color }) => <CompassIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "Altímetro",
            headerShown: false,
            tabBarIcon: ({ color }) => <GaugeIcon color={color} />,
          }}
        />
      </Tabs>
    </AppContextProvider>
  );
}
