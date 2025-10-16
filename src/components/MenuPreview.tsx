import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Truck, ShoppingBag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MenuPreviewProps {
  storeChannels: {
    delivery: boolean;
    takeaway: boolean;
  };
}

const MenuPreview = ({ storeChannels }: MenuPreviewProps) => {
  const mockProducts = [
    {
      id: "1",
      name: "Margherita Pizza",
      description: "Classic tomato sauce, mozzarella, fresh basil",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
      category: "Pizza",
      rating: 4.5,
      prepTime: "25-30 min",
      deliveryAvailable: true,
      takeawayAvailable: true,
      tags: ["Vegetarian", "Popular"]
    },
    {
      id: "2",
      name: "Family Feast Combo",
      description: "Perfect for sharing with family",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
      category: "Combos",
      rating: 4.8,
      prepTime: "35-40 min",
      deliveryAvailable: true,
      takeawayAvailable: true,
      tags: ["Combo", "Family Size"],
      comboItems: ["1 Pizza", "1 Pasta", "2 Sides", "2 Drinks"]
    },
    {
      id: "3",
      name: "Pasta Carbonara",
      description: "Creamy sauce, bacon, parmesan cheese",
      price: 13.99,
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
      category: "Pasta",
      rating: 4.6,
      prepTime: "20-25 min",
      deliveryAvailable: true,
      takeawayAvailable: false,
      tags: ["Bestseller"]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Menu Preview</h2>
        <p className="text-muted-foreground text-sm">
          Preview how your menu items will appear to customers
        </p>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {product.deliveryAvailable && storeChannels.delivery && (
                    <Badge className="bg-primary/90 backdrop-blur-sm">
                      <Truck className="w-3 h-3 mr-1" />
                      Delivery
                    </Badge>
                  )}
                  {product.takeawayAvailable && storeChannels.takeaway && (
                    <Badge className="bg-secondary/90 backdrop-blur-sm">
                      <ShoppingBag className="w-3 h-3 mr-1" />
                      Takeaway
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <span className="text-lg font-bold text-primary">${product.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {product.comboItems && (
                  <div className="bg-primary/5 rounded-lg p-2">
                    <p className="text-xs font-medium text-primary mb-1">Includes:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.comboItems.map((item, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-warning">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{product.prepTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {mockProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      </div>
                      <span className="text-xl font-bold text-primary">${product.price}</span>
                    </div>

                    {product.comboItems && (
                      <div className="bg-primary/5 rounded-lg p-2 inline-block">
                        <p className="text-xs font-medium text-primary mb-1">Includes:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.comboItems.map((item, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-warning">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{product.prepTime}</span>
                      </div>
                      <div className="flex gap-1">
                        {product.deliveryAvailable && storeChannels.delivery && (
                          <Badge variant="outline" className="text-xs">
                            <Truck className="w-3 h-3 mr-1" />
                            Delivery
                          </Badge>
                        )}
                        {product.takeawayAvailable && storeChannels.takeaway && (
                          <Badge variant="outline" className="text-xs">
                            <ShoppingBag className="w-3 h-3 mr-1" />
                            Takeaway
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuPreview;
