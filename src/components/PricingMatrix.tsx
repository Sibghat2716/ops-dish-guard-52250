import { useState } from "react";
import { DollarSign, Truck, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PricingMatrixProps {
  selectedStore: string;
  onHasChanges: (hasChanges: boolean) => void;
}

interface ProductPricing {
  id: string;
  name: string;
  basePrice: number;
  deliveryPrice: number;
  takeawayPrice: number;
}

const PricingMatrix = ({ selectedStore, onHasChanges }: PricingMatrixProps) => {
  const [products, setProducts] = useState<ProductPricing[]>([
    {
      id: "1",
      name: "Margherita Pizza",
      basePrice: 12.99,
      deliveryPrice: 12.99,
      takeawayPrice: 11.99
    },
    {
      id: "2",
      name: "Pasta Carbonara",
      basePrice: 13.99,
      deliveryPrice: 13.99,
      takeawayPrice: 12.99
    },
    {
      id: "3",
      name: "Family Feast Combo",
      basePrice: 24.99,
      deliveryPrice: 24.99,
      takeawayPrice: 22.99
    },
    {
      id: "4",
      name: "Chicken Caesar Salad",
      basePrice: 10.99,
      deliveryPrice: 10.99,
      takeawayPrice: 9.99
    }
  ]);

  const updatePrice = (id: string, channel: 'deliveryPrice' | 'takeawayPrice', value: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [channel]: parseFloat(value) || 0 } : p
    ));
    onHasChanges(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Channel-Specific Pricing
          </CardTitle>
          <CardDescription>
            Set different prices for delivery and takeaway channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Delivery Price
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Takeaway Price
                  </div>
                </TableHead>
                <TableHead>Discount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const basePrice = Number(product.basePrice);
                const deliveryPrice = Number(product.deliveryPrice);
                const takeawayPrice = Number(product.takeawayPrice);
                
                const deliveryDiscount = basePrice > deliveryPrice
                  ? ((basePrice - deliveryPrice) / basePrice * 100).toFixed(0)
                  : '0';
                const takeawayDiscount = basePrice > takeawayPrice
                  ? ((basePrice - takeawayPrice) / basePrice * 100).toFixed(0)
                  : '0';

                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">${product.basePrice.toFixed(2)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={product.deliveryPrice}
                          onChange={(e) => updatePrice(product.id, 'deliveryPrice', e.target.value)}
                          className="w-24"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={product.takeawayPrice}
                          onChange={(e) => updatePrice(product.id, 'takeawayPrice', e.target.value)}
                          className="w-24"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {Number(deliveryDiscount) > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            D: {deliveryDiscount}% off
                          </Badge>
                        )}
                        {Number(takeawayDiscount) > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            T: {takeawayDiscount}% off
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingMatrix;
