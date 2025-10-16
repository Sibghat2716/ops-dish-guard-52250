import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface StoreDetailsProps {
  selectedStore: string;
  onHasChanges: (hasChanges: boolean) => void;
}

const StoreDetails = ({ selectedStore, onHasChanges }: StoreDetailsProps) => {
  const [storeData, setStoreData] = useState({
    name: "Downtown Store",
    location: "Downtown District",
    address: "123 Main Street, City Center",
    postalCode: "12345",
    phone: "+1 234-567-8900",
    email: "downtown@store.com",
    mapsLink: "https://maps.google.com/?q=123+Main+Street"
  });

  const handleInputChange = (field: string, value: string) => {
    setStoreData({ ...storeData, [field]: value });
    onHasChanges(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Store Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="store-name">Store Name</Label>
              <Input
                id="store-name"
                value={storeData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={storeData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={storeData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postal">Postal Code</Label>
              <Input
                id="postal"
                value={storeData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={storeData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={storeData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maps">Google Maps Link</Label>
            <div className="flex gap-2">
              <Input
                id="maps"
                value={storeData.mapsLink}
                onChange={(e) => handleInputChange('mapsLink', e.target.value)}
              />
              <Button variant="outline" size="icon" asChild>
                <a href={storeData.mapsLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreDetails;
