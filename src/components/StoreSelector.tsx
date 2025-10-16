import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, MapPin, Truck, ShoppingBag, CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls";

const stores = [
  { id: "pavilion", name: "Pavilion KL", address: "168, Jalan Bukit Bintang, 55100 Kuala Lumpur" },
  { id: "midvalley", name: "Mid Valley Megamall", address: "Lingkaran Syed Putra, 59200 Kuala Lumpur" },
  { id: "1utama", name: "1 Utama Shopping Centre", address: "1, Lebuh Bandar Utama, 47800 Petaling Jaya" },
  { id: "klcc", name: "Suria KLCC", address: "Kuala Lumpur City Centre, 50088 Kuala Lumpur" },
  { id: "sunway", name: "Sunway Pyramid", address: "3, Jalan PJS 11/15, 47500 Subang Jaya" },
  { id: "ioi", name: "IOI City Mall", address: "Lebuh IRC, IOI Resort, 62502 Putrajaya" },
  { id: "thecurve", name: "The Curve", address: "Mutiara Damansara, 47800 Petaling Jaya" },
  { id: "sunwayvelocity", name: "Sunway Velocity Mall", address: "Lingkaran SV, 55100 Kuala Lumpur" },
  { id: "paradigm", name: "Paradigm Mall", address: "1, Jalan SS 7/26A, 47301 Petaling Jaya" },
  { id: "tropicana", name: "Tropicana City Mall", address: "3, Jalan SS 20/27, 47400 Petaling Jaya" },
  { id: "bangsarvillage", name: "Bangsar Village", address: "Jalan Telawi 1, Bangsar Baru, 59100 Kuala Lumpur" },
  { id: "nusentral", name: "NU Sentral", address: "201, Jalan Tun Sambanthan, 50470 Kuala Lumpur" },
  { id: "quilcity", name: "Quill City Mall", address: "1018, Jalan Sultan Ismail, 50250 Kuala Lumpur" },
  { id: "berjayatimes", name: "Berjaya Times Square", address: "1, Jalan Imbi, 55100 Kuala Lumpur" },
  { id: "setiacitymall", name: "Setia City Mall", address: "Persiaran Setia Dagang, Setia Alam, 40170 Shah Alam" },
  { id: "alamcentral", name: "Alam Central", address: "Jalan Majlis, Seksyen 14, 40000 Shah Alam" },
  { id: "empire", name: "Empire Shopping Gallery", address: "Jalan SS 16/1, 47500 Subang Jaya" },
  { id: "subangparade", name: "Subang Parade", address: "5, Jalan SS 16/1, 47500 Subang Jaya" },
  { id: "dpulze", name: "Dpulze Cyberjaya", address: "Persiaran Multimedia, 63000 Cyberjaya" },
  { id: "ioimallpuchong", name: "IOI Mall Puchong", address: "Bdr Puchong Jaya, 47100 Puchong" },
  { id: "setapak", name: "Setapak Central", address: "Jalan Danau Niaga 1, Taman Danau Kota, 53300 Kuala Lumpur" },
  { id: "ampwalk", name: "Ampang Point", address: "Jalan Mamanda 3, Taman Dato Ahmad Razali, 68000 Ampang" },
  { id: "mytown", name: "MyTOWN Shopping Centre", address: "6, Jalan Cochrane, 55100 Cheras" },
  { id: "thegardens", name: "The Gardens Mall", address: "Lingkaran Syed Putra, 59200 Kuala Lumpur" },
  { id: "tamarind", name: "Tamarind Square", address: "Persiaran Multimedia, 63000 Cyberjaya" },
];

interface StoreSelectorProps {
  selectedStore: string;
  onStoreChange: (storeId: string) => void;
  storeChannels: {
    delivery: boolean;
    takeaway: boolean;
    curbside: boolean;
  };
  onStoreChannelChange: (channels: { delivery: boolean; takeaway: boolean; curbside: boolean }) => void;
  showChannels?: boolean;
}

const StoreSelector = ({ selectedStore, onStoreChange, storeChannels, onStoreChannelChange, showChannels = true }: StoreSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const selectedStoreData = stores.find(store => store.id === selectedStore);

  const filteredStores = useMemo(() => {
    return stores.filter(store =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const {
    paginatedData,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    goToPage,
    changePageSize,
    hasNextPage,
    hasPreviousPage,
  } = usePagination(filteredStores);

  const handleChannelChange = (channelType: 'delivery' | 'takeaway' | 'curbside', checked: boolean) => {
    if (!checked) {
      // Show notification for temporary disabling with progress bar
      const channelName = channelType === 'delivery' ? 'Delivery' : channelType === 'takeaway' ? 'Takeaway' : 'Curbside';
      const { dismiss } = toast({
        title: `${channelName} Temporarily Disabled`,
        description: (
          <div className="space-y-2">
            <p>This channel will automatically turn back on at the start of business tomorrow.</p>
            <p className="text-sm text-muted-foreground">
              For permanent changes or custom schedules, go to the <strong>Store Status</strong> tab.
            </p>
          </div>
        ),
        duration: 10000,
        showClose: false,
        action: (
          <Button
            size="sm"
            onClick={() => dismiss()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            OK
          </Button>
        ),
      });
      
      // Mark as temporary when disabled from Store Selector
      onStoreChannelChange({
        ...storeChannels,
        [channelType]: checked,
        [`${channelType}Temporary`]: true,
      });
    } else {
      // Clear temporary flag when re-enabled
      onStoreChannelChange({
        ...storeChannels,
        [channelType]: checked,
        [`${channelType}Temporary`]: false,
      });
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Store Selection */}
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-80 justify-between bg-card"
        >
          {selectedStoreData ? (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div className="text-left">
                <div className="font-medium">{selectedStoreData.name}</div>
                <div className="text-xs text-muted-foreground">{selectedStoreData.address}</div>
              </div>
            </div>
          ) : (
            "Select store..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] sm:w-80 p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search stores..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <ScrollArea className="h-[300px]">
            <CommandList>
              <CommandEmpty>No store found.</CommandEmpty>
              <CommandGroup>
                {paginatedData.map((store) => (
                  <CommandItem
                    key={store.id}
                    value={store.id}
                    onSelect={(currentValue) => {
                      onStoreChange(currentValue);
                      setOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedStore === store.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{store.name}</div>
                        <div className="text-xs text-muted-foreground">{store.address}</div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </ScrollArea>
          {filteredStores.length > 10 && (
            <div className="border-t p-2">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={goToPage}
                onPageSizeChange={changePageSize}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
              />
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>

      {/* Store Channel Settings */}
      {selectedStoreData && showChannels && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="w-4 h-4" />
              Store Channel Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Delivery</span>
                </div>
                <Switch
                  checked={storeChannels.delivery}
                  onCheckedChange={(checked) => handleChannelChange('delivery', checked)}
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Takeaway</span>
                </div>
                <Switch
                  checked={storeChannels.takeaway}
                  onCheckedChange={(checked) => handleChannelChange('takeaway', checked)}
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2">
                  <CarFront className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Curbside</span>
                </div>
                <Switch
                  checked={storeChannels.curbside}
                  onCheckedChange={(checked) => handleChannelChange('curbside', checked)}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Enable or disable channels for this store. Disabling a channel is temporary and will auto-enable at the start of business tomorrow. For permanent changes, visit the <strong>Store Status</strong> tab.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StoreSelector;