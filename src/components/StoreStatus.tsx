import { useState, useEffect } from "react";
import { Power, Truck, ShoppingBag, CarFront, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface StoreStatusProps {
  selectedStore: string;
  onHasChanges: (hasChanges: boolean) => void;
  storeChannels: {
    delivery: boolean;
    takeaway: boolean;
    curbside: boolean;
    deliveryTemporary?: boolean;
    takeawayTemporary?: boolean;
    curbsideTemporary?: boolean;
  };
  onStoreChannelChange: (channels: { delivery: boolean; takeaway: boolean; curbside: boolean }) => void;
}

const StoreStatus = ({ selectedStore, onHasChanges, storeChannels, onStoreChannelChange }: StoreStatusProps) => {
  const deliveryEnabled = storeChannels.delivery;
  const takeawayEnabled = storeChannels.takeaway;
  const curbsideEnabled = storeChannels.curbside;
  const deliveryTemporary = storeChannels.deliveryTemporary || false;
  const takeawayTemporary = storeChannels.takeawayTemporary || false;
  const curbsideTemporary = storeChannels.curbsideTemporary || false;
  
  // Compute store open state based on channels
  const allDisabled = !deliveryEnabled && !takeawayEnabled && !curbsideEnabled;
  const storeOpen = !allDisabled;
  
  const [deliveryStatus, setDeliveryStatus] = useState<'on' | 'off' | 'temporary'>(
    deliveryEnabled ? 'on' : (deliveryTemporary ? 'temporary' : 'off')
  );
  const [takeawayStatus, setTakeawayStatus] = useState<'on' | 'off' | 'temporary'>(
    takeawayEnabled ? 'on' : (takeawayTemporary ? 'temporary' : 'off')
  );
  const [curbsideStatus, setCurbsideStatus] = useState<'on' | 'off' | 'temporary'>(
    curbsideEnabled ? 'on' : (curbsideTemporary ? 'temporary' : 'off')
  );
  const [deliveryDowntime, setDeliveryDowntime] = useState({ start: '', end: '' });
  const [takeawayDowntime, setTakeawayDowntime] = useState({ start: '', end: '' });
  const [curbsideDowntime, setCurbsideDowntime] = useState({ start: '', end: '' });

  // Sync status with channel changes from StoreSelector
  useEffect(() => {
    setDeliveryStatus(deliveryEnabled ? 'on' : (deliveryTemporary ? 'temporary' : 'off'));
    setTakeawayStatus(takeawayEnabled ? 'on' : (takeawayTemporary ? 'temporary' : 'off'));
    setCurbsideStatus(curbsideEnabled ? 'on' : (curbsideTemporary ? 'temporary' : 'off'));
  }, [deliveryEnabled, takeawayEnabled, curbsideEnabled, deliveryTemporary, takeawayTemporary, curbsideTemporary]);

  const handleStoreToggle = (checked: boolean) => {
    // Master toggle: controls all channels
    if (checked) {
      // Turn on all channels when store opens
      onStoreChannelChange({ delivery: true, takeaway: true, curbside: true });
    } else {
      // Turn off all channels when store closes
      onStoreChannelChange({ delivery: false, takeaway: false, curbside: false });
    }
    onHasChanges(true);
  };

  const handleDeliveryStatusChange = (value: 'on' | 'off' | 'temporary') => {
    setDeliveryStatus(value);
    onHasChanges(true);
  };

  const handleTakeawayStatusChange = (value: 'on' | 'off' | 'temporary') => {
    setTakeawayStatus(value);
    onHasChanges(true);
  };

  const handleCurbsideStatusChange = (value: 'on' | 'off' | 'temporary') => {
    setCurbsideStatus(value);
    onHasChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Master Store Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Power className="w-5 h-5" />
            Store Status
          </CardTitle>
          <CardDescription>Control overall store operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Power className={`w-5 h-5 ${storeOpen ? 'text-success' : 'text-destructive'}`} />
              <div>
                <p className="font-medium">Store Operations</p>
                <p className="text-sm text-muted-foreground">
                  {!deliveryEnabled && !takeawayEnabled && !curbsideEnabled
                    ? 'Store is currently closed' 
                    : (deliveryEnabled && takeawayEnabled && curbsideEnabled)
                    ? 'Store is currently open'
                    : 'Store is partially open'}
                </p>
              </div>
            </div>
            <Switch
              checked={storeOpen}
              onCheckedChange={handleStoreToggle}
              className="data-[state=checked]:bg-success"
            />
          </div>
        </CardContent>
      </Card>

      {/* Delivery Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Delivery Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={deliveryStatus} onValueChange={handleDeliveryStatusChange}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="on" id="delivery-on" />
              <Label htmlFor="delivery-on" className="flex-1 cursor-pointer">
                <div className="font-medium">Available</div>
                <div className="text-sm text-muted-foreground">Delivery is operational</div>
              </Label>
              <Badge variant="default" className="bg-success">Active</Badge>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="off" id="delivery-off" />
              <Label htmlFor="delivery-off" className="flex-1 cursor-pointer">
                <div className="font-medium">Permanently Disabled</div>
                <div className="text-sm text-muted-foreground">Turn off delivery until manually enabled</div>
              </Label>
              <Badge variant="destructive">Disabled</Badge>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="temporary" id="delivery-temp" />
              <Label htmlFor="delivery-temp" className="flex-1 cursor-pointer">
                <div className="font-medium">Temporary Downtime</div>
                <div className="text-sm text-muted-foreground">Schedule a temporary disable period</div>
              </Label>
              <Badge variant="secondary">Scheduled</Badge>
            </div>
          </RadioGroup>

          {deliveryStatus === 'temporary' && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                Schedule Downtime
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delivery-start">Start Time</Label>
                  <Input
                    id="delivery-start"
                    type="datetime-local"
                    value={deliveryDowntime.start}
                    onChange={(e) => {
                      setDeliveryDowntime({ ...deliveryDowntime, start: e.target.value });
                      onHasChanges(true);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-end">End Time</Label>
                  <Input
                    id="delivery-end"
                    type="datetime-local"
                    value={deliveryDowntime.end}
                    onChange={(e) => {
                      setDeliveryDowntime({ ...deliveryDowntime, end: e.target.value });
                      onHasChanges(true);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Takeaway Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Takeaway Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={takeawayStatus} onValueChange={handleTakeawayStatusChange}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="on" id="takeaway-on" />
              <Label htmlFor="takeaway-on" className="flex-1 cursor-pointer">
                <div className="font-medium">Available</div>
                <div className="text-sm text-muted-foreground">Takeaway is operational</div>
              </Label>
              <Badge variant="default" className="bg-success">Active</Badge>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="off" id="takeaway-off" />
              <Label htmlFor="takeaway-off" className="flex-1 cursor-pointer">
                <div className="font-medium">Permanently Disabled</div>
                <div className="text-sm text-muted-foreground">Turn off takeaway until manually enabled</div>
              </Label>
              <Badge variant="destructive">Disabled</Badge>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="temporary" id="takeaway-temp" />
              <Label htmlFor="takeaway-temp" className="flex-1 cursor-pointer">
                <div className="font-medium">Temporary Downtime</div>
                <div className="text-sm text-muted-foreground">Schedule a temporary disable period</div>
              </Label>
              <Badge variant="secondary">Scheduled</Badge>
            </div>
          </RadioGroup>

          {takeawayStatus === 'temporary' && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                Schedule Downtime
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="takeaway-start">Start Time</Label>
                  <Input
                    id="takeaway-start"
                    type="datetime-local"
                    value={takeawayDowntime.start}
                    onChange={(e) => {
                      setTakeawayDowntime({ ...takeawayDowntime, start: e.target.value });
                      onHasChanges(true);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="takeaway-end">End Time</Label>
                  <Input
                    id="takeaway-end"
                    type="datetime-local"
                    value={takeawayDowntime.end}
                    onChange={(e) => {
                      setTakeawayDowntime({ ...takeawayDowntime, end: e.target.value });
                      onHasChanges(true);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Curbside Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CarFront className="w-5 h-5" />
            Curbside Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={curbsideStatus} onValueChange={handleCurbsideStatusChange}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="on" id="curbside-on" />
              <Label htmlFor="curbside-on" className="flex-1 cursor-pointer">
                <div className="font-medium">Available</div>
                <div className="text-sm text-muted-foreground">Curbside is operational</div>
              </Label>
              <Badge variant="default" className="bg-success">Active</Badge>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="off" id="curbside-off" />
              <Label htmlFor="curbside-off" className="flex-1 cursor-pointer">
                <div className="font-medium">Permanently Disabled</div>
                <div className="text-sm text-muted-foreground">Turn off curbside until manually enabled</div>
              </Label>
              <Badge variant="destructive">Disabled</Badge>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="temporary" id="curbside-temp" />
              <Label htmlFor="curbside-temp" className="flex-1 cursor-pointer">
                <div className="font-medium">Temporary Downtime</div>
                <div className="text-sm text-muted-foreground">Schedule a temporary disable period</div>
              </Label>
              <Badge variant="secondary">Scheduled</Badge>
            </div>
          </RadioGroup>

          {curbsideStatus === 'temporary' && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                Schedule Downtime
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="curbside-start">Start Time</Label>
                  <Input
                    id="curbside-start"
                    type="datetime-local"
                    value={curbsideDowntime.start}
                    onChange={(e) => {
                      setCurbsideDowntime({ ...curbsideDowntime, start: e.target.value });
                      onHasChanges(true);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="curbside-end">End Time</Label>
                  <Input
                    id="curbside-end"
                    type="datetime-local"
                    value={curbsideDowntime.end}
                    onChange={(e) => {
                      setCurbsideDowntime({ ...curbsideDowntime, end: e.target.value });
                      onHasChanges(true);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreStatus;
