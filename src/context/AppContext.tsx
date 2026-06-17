import * as Location from "expo-location";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AppContext {
  hasLocationPermission: boolean | null;
}

const AppContext = createContext<AppContext | undefined>(undefined);

export default function AppContextProvider({ children }: PropsWithChildren) {
  const [hasLocationPermission, setLocationPermission] =
    useState<AppContext["hasLocationPermission"]>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");
    })();
  }, []);

  return (
    <AppContext.Provider value={{ hasLocationPermission }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}
