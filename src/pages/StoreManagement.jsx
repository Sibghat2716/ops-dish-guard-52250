import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Power, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import StoreDetails from "@/components/StoreDetails";
import OperatingHours from "@/components/OperatingHours";
import StoreStatus from "@/components/StoreStatus";

import StoreSelector from "@/components/StoreSelector";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/contexts/StoreContext";

const StoreManagement = () => {
  const { toast } = useToast();
  const { getStoreChannels, updateStoreChannels } = useStore();
  const [selectedStore, setSelectedStore] = useState("pavilion");
  const [hasChanges, setHasChanges] = useState(false);
  
  const storeChannels = getStoreChannels(selectedStore);
  
  const handleStoreChannelChange = (channels) => {
    updateStoreChannels(selectedStore, channels);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "All store settings have been saved successfully.",
    });
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={["Store Management", selectedStore]}
        title="Store Management"
        description="Manage store details, hours, and status"
        actions={
          <Button 
            onClick={handleSaveChanges} 
            disabled={!hasChanges}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        }
      />

      <StoreSelector
        selectedStore={selectedStore}
        onStoreChange={setSelectedStore}
        storeChannels={storeChannels}
        onStoreChannelChange={handleStoreChannelChange}
        showChannels={true}
      />

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Hours
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Power className="w-4 h-4" />
            Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <StoreDetails selectedStore={selectedStore} onHasChanges={setHasChanges} />
        </TabsContent>

        <TabsContent value="hours">
          <OperatingHours selectedStore={selectedStore} onHasChanges={setHasChanges} />
        </TabsContent>

        <TabsContent value="status">
          <StoreStatus 
            selectedStore={selectedStore} 
            onHasChanges={setHasChanges}
            storeChannels={storeChannels}
            onStoreChannelChange={handleStoreChannelChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreManagement;
