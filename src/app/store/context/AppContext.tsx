import { createContext, useState } from "react";
import Sigma from "sigma";

type AppContextInitialValue = {
  globalSigmaInstance: Sigma | null,
  setSigmaInstance: (sigma: Sigma | null) => void;
}

const initialValue: AppContextInitialValue = {
  globalSigmaInstance: null,
  setSigmaInstance: (sigma: Sigma | null) => {}
}

type AppContextProviderProps = {
  children: React.ReactNode
}

export const AppContext = createContext(initialValue);

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [globalSigmaInstance, setSigmaInstance] = useState<Sigma | null>(null);
  
  return <AppContext.Provider value={{globalSigmaInstance, setSigmaInstance}}>{children}</AppContext.Provider>
}
