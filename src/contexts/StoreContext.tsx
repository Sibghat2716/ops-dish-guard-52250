import { createContext, useContext, useState, ReactNode } from "react";

interface StoreChannels {
  delivery: boolean;
  takeaway: boolean;
  curbside: boolean;
  deliveryTemporary?: boolean;
  takeawayTemporary?: boolean;
  curbsideTemporary?: boolean;
}

interface StoreData {
  [storeId: string]: StoreChannels;
}

interface StoreContextType {
  storeChannels: StoreData;
  updateStoreChannels: (storeId: string, channels: StoreChannels) => void;
  getStoreChannels: (storeId: string) => StoreChannels;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Initialize with default values for all stores
const initialStoreData: StoreData = {
  pavilion: { delivery: true, takeaway: true, curbside: true },
  midvalley: { delivery: true, takeaway: true, curbside: true },
  "1utama": { delivery: true, takeaway: true, curbside: true },
  klcc: { delivery: true, takeaway: true, curbside: true },
  sunway: { delivery: true, takeaway: true, curbside: true },
  ioi: { delivery: true, takeaway: true, curbside: true },
  thecurve: { delivery: true, takeaway: true, curbside: true },
  sunwayvelocity: { delivery: true, takeaway: true, curbside: true },
  paradigm: { delivery: true, takeaway: true, curbside: true },
  tropicana: { delivery: false, takeaway: true, curbside: true },
  bangsarvillage: { delivery: true, takeaway: true, curbside: true },
  nusentral: { delivery: true, takeaway: true, curbside: true },
  quilcity: { delivery: true, takeaway: true, curbside: true },
  berjayatimes: { delivery: true, takeaway: true, curbside: true },
  setiacitymall: { delivery: true, takeaway: true, curbside: true },
  alamcentral: { delivery: true, takeaway: true, curbside: true },
  empire: { delivery: true, takeaway: true, curbside: true },
  subangparade: { delivery: false, takeaway: true, curbside: true },
  dpulze: { delivery: true, takeaway: true, curbside: true },
  ioimallpuchong: { delivery: true, takeaway: true, curbside: true },
  setapak: { delivery: true, takeaway: true, curbside: true },
  ampwalk: { delivery: true, takeaway: true, curbside: true },
  mytown: { delivery: true, takeaway: true, curbside: true },
  thegardens: { delivery: true, takeaway: true, curbside: true },
  tamarind: { delivery: false, takeaway: true, curbside: true },
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [storeChannels, setStoreChannels] = useState<StoreData>(initialStoreData);

  const updateStoreChannels = (storeId: string, channels: StoreChannels) => {
    setStoreChannels(prev => ({
      ...prev,
      [storeId]: channels
    }));
  };

  const getStoreChannels = (storeId: string): StoreChannels => {
    return storeChannels[storeId] || { delivery: true, takeaway: true, curbside: true };
  };

  return (
    <StoreContext.Provider value={{ storeChannels, updateStoreChannels, getStoreChannels }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
