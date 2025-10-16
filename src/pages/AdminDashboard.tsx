import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Clock, Truck, ShoppingBag, ChefHat, Eye, MapPin, RefreshCw, Search, Filter, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/contexts/StoreContext";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls";

interface Store {
  id: string;
  name: string;
  address: string;
  openTime: string;
  closeTime: string;
  deliveryEnabled: boolean;
  takeawayEnabled: boolean;
  totalMenuItems: number;
  availableMenuItems: number;
  status: "open" | "closed";
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getStoreChannels } = useStore();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">("all");
  const [channelFilter, setChannelFilter] = useState<"all" | "delivery" | "takeaway">("all");
  const [isAddStoreDialogOpen, setIsAddStoreDialogOpen] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    addressLine1: "",
    addressLine2: "",
    openTime: "10:00",
    closeTime: "22:00",
  });
  const [stores] = useState<Store[]>([
    { id: "pavilion", name: "Pavilion KL", address: "168, Jalan Bukit Bintang, 55100 Kuala Lumpur", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 42, status: "open" },
    { id: "midvalley", name: "Mid Valley Megamall", address: "Lingkaran Syed Putra, 59200 Kuala Lumpur", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 43, status: "open" },
    { id: "1utama", name: "1 Utama Shopping Centre", address: "1, Lebuh Bandar Utama, 47800 Petaling Jaya", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 45, status: "open" },
    { id: "klcc", name: "Suria KLCC", address: "Kuala Lumpur City Centre, 50088 Kuala Lumpur", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 41, status: "open" },
    { id: "sunway", name: "Sunway Pyramid", address: "3, Jalan PJS 11/15, 47500 Subang Jaya", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 44, status: "open" },
    { id: "ioi", name: "IOI City Mall", address: "Lebuh IRC, IOI Resort, 62502 Putrajaya", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 40, status: "closed" },
    { id: "thecurve", name: "The Curve", address: "Mutiara Damansara, 47800 Petaling Jaya", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 43, status: "open" },
    { id: "sunwayvelocity", name: "Sunway Velocity Mall", address: "Lingkaran SV, 55100 Kuala Lumpur", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 42, status: "open" },
    { id: "paradigm", name: "Paradigm Mall", address: "1, Jalan SS 7/26A, 47301 Petaling Jaya", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 45, status: "open" },
    { id: "tropicana", name: "Tropicana City Mall", address: "3, Jalan SS 20/27, 47400 Petaling Jaya", openTime: "10:00", closeTime: "22:00", deliveryEnabled: false, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 38, status: "open" },
    { id: "bangsarvillage", name: "Bangsar Village", address: "Jalan Telawi 1, Bangsar Baru, 59100 Kuala Lumpur", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 44, status: "open" },
    { id: "nusentral", name: "NU Sentral", address: "201, Jalan Tun Sambanthan, 50470 Kuala Lumpur", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 43, status: "open" },
    { id: "quilcity", name: "Quill City Mall", address: "1018, Jalan Sultan Ismail, 50250 Kuala Lumpur", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 41, status: "open" },
    { id: "berjayatimes", name: "Berjaya Times Square", address: "1, Jalan Imbi, 55100 Kuala Lumpur", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 42, status: "closed" },
    { id: "setiacitymall", name: "Setia City Mall", address: "Persiaran Setia Dagang, Setia Alam, 40170 Shah Alam", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 39, status: "open" },
    { id: "alamcentral", name: "Alam Central", address: "Jalan Majlis, Seksyen 14, 40000 Shah Alam", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 44, status: "open" },
    { id: "empire", name: "Empire Shopping Gallery", address: "Jalan SS 16/1, 47500 Subang Jaya", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 43, status: "open" },
    { id: "subangparade", name: "Subang Parade", address: "5, Jalan SS 16/1, 47500 Subang Jaya", openTime: "10:00", closeTime: "22:00", deliveryEnabled: false, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 37, status: "open" },
    { id: "dpulze", name: "Dpulze Cyberjaya", address: "Persiaran Multimedia, 63000 Cyberjaya", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 45, status: "open" },
    { id: "ioimallpuchong", name: "IOI Mall Puchong", address: "Bdr Puchong Jaya, 47100 Puchong", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 42, status: "open" },
    { id: "setapak", name: "Setapak Central", address: "Jalan Danau Niaga 1, Taman Danau Kota, 53300 Kuala Lumpur", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 40, status: "closed" },
    { id: "ampwalk", name: "Ampang Point", address: "Jalan Mamanda 3, Taman Dato Ahmad Razali, 68000 Ampang", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 43, status: "open" },
    { id: "mytown", name: "MyTOWN Shopping Centre", address: "6, Jalan Cochrane, 55100 Cheras", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 44, status: "open" },
    { id: "thegardens", name: "The Gardens Mall", address: "Lingkaran Syed Putra, 59200 Kuala Lumpur", openTime: "10:00", closeTime: "22:00", deliveryEnabled: true, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 45, status: "open" },
    { id: "tamarind", name: "Tamarind Square", address: "Persiaran Multimedia, 63000 Cyberjaya", openTime: "10:00", closeTime: "22:00", deliveryEnabled: false, takeawayEnabled: true, totalMenuItems: 45, availableMenuItems: 36, status: "open" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-success text-success-foreground";
      case "closed": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleManageSettings = () => {
    if (selectedStore) {
      navigate("/store-management");
      setSelectedStore(null);
      toast({
        title: "Navigating to Store Settings",
        description: `Opening settings for ${selectedStore.name}`,
      });
    }
  };

  const handleViewMenu = () => {
    if (selectedStore) {
      navigate("/menu-management");
      setSelectedStore(null);
      toast({
        title: "Navigating to Menu Management",
        description: `Opening menu for ${selectedStore.name}`,
      });
    }
  };

  const getAvailabilityPercentage = (available: number, total: number) => {
    return Math.round((available / total) * 100);
  };

  const handleSyncUpdates = async () => {
    setIsSyncing(true);
    
    // Simulate syncing with core platform
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSyncing(false);
    toast({
      title: "Sync Complete",
      description: "Successfully synced latest updates from core platform. All store configurations are up to date.",
    });
  };

  const handleAddStore = () => {
    if (!newStore.name || !newStore.country || !newStore.state || !newStore.city || !newStore.postalCode || !newStore.addressLine1) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Store Added",
      description: `${newStore.name} has been added successfully.`,
    });
    
    setIsAddStoreDialogOpen(false);
    setNewStore({
      name: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
      addressLine1: "",
      addressLine2: "",
      openTime: "10:00",
      closeTime: "22:00",
    });
  };

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const currentChannels = getStoreChannels(store.id);
      const bothChannelsDisabled = !currentChannels.delivery && !currentChannels.takeaway;
      const displayStatus = bothChannelsDisabled ? "closed" : store.status;
      
      const matchesStatus = statusFilter === "all" || displayStatus === statusFilter;
      
      let matchesChannel = true;
      if (channelFilter === "delivery") {
        matchesChannel = currentChannels.delivery;
      } else if (channelFilter === "takeaway") {
        matchesChannel = currentChannels.takeaway;
      }
      
      return matchesSearch && matchesStatus && matchesChannel;
    });
  }, [stores, searchQuery, statusFilter, channelFilter, getStoreChannels]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stores Overview</h1>
          <p className="text-muted-foreground mt-2">
            Overview of all store locations and their current status
          </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search stores by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value: "all" | "open" | "closed") => setStatusFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={channelFilter} onValueChange={(value: "all" | "delivery" | "takeaway") => setChannelFilter(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="delivery">Delivery Only</SelectItem>
              <SelectItem value="takeaway">Takeaway Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsAddStoreDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Store
          </Button>
          <Button 
            onClick={handleSyncUpdates}
            disabled={isSyncing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? "Syncing..." : "Sync Updates"}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Store Name</TableHead>
                <TableHead className="w-[280px]">Location</TableHead>
                <TableHead className="w-[120px]">Operating Hours</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px]">Channels</TableHead>
                <TableHead className="w-[120px]">Menu Availability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((store) => {
                const currentChannels = getStoreChannels(store.id);
                const deliveryEnabled = currentChannels.delivery;
                const takeawayEnabled = currentChannels.takeaway;
                const bothChannelsDisabled = !deliveryEnabled && !takeawayEnabled;
                const displayStatus = bothChannelsDisabled ? "closed" : store.status;
                
                return (
                <TableRow 
                  key={store.id} 
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedStore(store)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      {store.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{store.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="whitespace-nowrap">{store.openTime} - {store.closeTime}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(displayStatus)}>
                      {displayStatus.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${(displayStatus === 'open' && deliveryEnabled) ? 'bg-green-50' : 'bg-red-50'}`}>
                        <Truck className={`w-3 h-3 ${(displayStatus === 'open' && deliveryEnabled) ? 'text-green-600' : 'text-red-400'}`} />
                      </div>
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${(displayStatus === 'open' && takeawayEnabled) ? 'bg-green-50' : 'bg-red-50'}`}>
                        <ShoppingBag className={`w-3 h-3 ${(displayStatus === 'open' && takeawayEnabled) ? 'text-green-600' : 'text-red-400'}`} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ChefHat className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {store.availableMenuItems}/{store.totalMenuItems}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{ 
                            width: `${getAvailabilityPercentage(store.availableMenuItems, store.totalMenuItems)}%` 
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {getAvailabilityPercentage(store.availableMenuItems, store.totalMenuItems)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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

      {/* Store Details Modal */}
      <Dialog open={!!selectedStore} onOpenChange={() => setSelectedStore(null)}>
        {selectedStore && (() => {
          const currentChannels = getStoreChannels(selectedStore.id);
          return (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {selectedStore.name}
              </DialogTitle>
              <DialogDescription>
                View and manage store details, channels, and menu availability
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Store Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Store Information</h4>
                  <div className="space-y-1 text-sm">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <span>{selectedStore.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedStore.openTime} - {selectedStore.closeTime}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(selectedStore.status)}>
                        {selectedStore.status.toUpperCase()}
                      </Badge>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Channel Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        <span className="text-sm">Delivery</span>
                      </div>
                      <Badge variant={currentChannels.delivery ? "default" : "secondary"}>
                        {currentChannels.delivery ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        <span className="text-sm">Takeaway</span>
                      </div>
                      <Badge variant={currentChannels.takeaway ? "default" : "secondary"}>
                        {currentChannels.takeaway ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Availability Breakdown */}
              <div>
                <h4 className="font-medium mb-3">Menu Availability Breakdown</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{selectedStore.totalMenuItems}</div>
                    <div className="text-sm text-muted-foreground">Total Items</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-success">{selectedStore.availableMenuItems}</div>
                    <div className="text-sm text-muted-foreground">Available</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-destructive">
                      {selectedStore.totalMenuItems - selectedStore.availableMenuItems}
                    </div>
                    <div className="text-sm text-muted-foreground">Unavailable</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleManageSettings}>
                  Manage Store Settings
                </Button>
                <Button onClick={handleViewMenu}>
                  View Menu Management
                </Button>
              </div>
            </div>
          </DialogContent>
          );
        })()}
      </Dialog>

      {/* Add New Store Dialog */}
      <Dialog open={isAddStoreDialogOpen} onOpenChange={setIsAddStoreDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Store</DialogTitle>
            <DialogDescription>
              Enter the details for the new store location
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name *</Label>
              <Input
                id="storeName"
                placeholder="e.g., Central Mall"
                value={newStore.name}
                onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Location Address</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    placeholder="e.g., Malaysia"
                    value={newStore.country}
                    onChange={(e) => setNewStore({ ...newStore, country: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    placeholder="e.g., Kuala Lumpur"
                    value={newStore.state}
                    onChange={(e) => setNewStore({ ...newStore, state: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Kuala Lumpur"
                    value={newStore.city}
                    onChange={(e) => setNewStore({ ...newStore, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    placeholder="e.g., 50000"
                    value={newStore.postalCode}
                    onChange={(e) => setNewStore({ ...newStore, postalCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input
                  id="addressLine1"
                  placeholder="Street address, building name, etc."
                  value={newStore.addressLine1}
                  onChange={(e) => setNewStore({ ...newStore, addressLine1: e.target.value })}
                />
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  placeholder="Additional address details (optional)"
                  value={newStore.addressLine2}
                  onChange={(e) => setNewStore({ ...newStore, addressLine2: e.target.value })}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Operating Hours</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openTime">Opening Time</Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={newStore.openTime}
                    onChange={(e) => setNewStore({ ...newStore, openTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closeTime">Closing Time</Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={newStore.closeTime}
                    onChange={(e) => setNewStore({ ...newStore, closeTime: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddStoreDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStore}>
              Add Store
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;