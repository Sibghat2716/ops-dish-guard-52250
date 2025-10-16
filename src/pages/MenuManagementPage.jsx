import { useState } from "react";
import StoreSelector from "@/components/StoreSelector";
import MenuManagement from "./MenuManagement";

const MenuManagementPage = () => {
  const [selectedStore, setSelectedStore] = useState("downtown");
  const [storeChannels, setStoreChannels] = useState({
    delivery: true,
    takeaway: true,
    curbside: true,
  });

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-end w-full">
      <StoreSelector
        selectedStore={selectedStore}
        onStoreChange={setSelectedStore}
        storeChannels={storeChannels}
        onStoreChannelChange={setStoreChannels}
        showChannels={false}
      />
      </div>
      
      <MenuManagement 
        selectedStore={selectedStore}
        storeChannels={storeChannels}
      />
    </div>
  );
};

export default MenuManagementPage;
