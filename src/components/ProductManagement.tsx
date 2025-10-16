import { useState } from "react";
import { Search, Package, Truck, ShoppingBag, Save, Clock, Calendar, Settings, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls";

interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  deliveryAvailable: boolean;
  takeawayAvailable: boolean;
  description: string;
  discontinued: boolean;
  productType: 'combo' | 'ala-carte' | 'topping' | 'gift';
  comboConstruct?: string;
  image?: string;
  tags: string[];
  variants?: {
    size?: string[];
    crust?: string[];
  };
  toppings?: {
    name: string;
    free: boolean;
    additionalCost?: number;
  }[];
  searchable: boolean;
  listable: boolean;
  individuallyBuyable: boolean;
  isNew?: boolean;
  isDeployed?: boolean;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Super Supreme",
    category: "Pizza",
    subCategory: "Signature Pizzas",
    price: 42.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Juicy ground beef, beef cabanossi sausages, beef pepperoni, chicken ham, capsicums, onions, olives, mushrooms and pineapple chunks",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Popular", "Signature"],
    variants: {
      size: ["Regular", "Large", "Extra Large"],
      crust: ["Pan", "Stuffed Crust", "Cheesy Bites"]
    },
    searchable: true,
    listable: true,
    individuallyBuyable: true,
    isNew: true,
    isDeployed: false
  },
  {
    id: "2",
    name: "Chicken Supreme",
    category: "Pizza",
    subCategory: "Signature Pizzas",
    price: 40.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Chicken ham, spicy chicken chunks, roasted chicken, onions, capsicums and mushrooms",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Popular", "Chicken"],
    variants: {
      size: ["Regular", "Large", "Extra Large"],
      crust: ["Pan", "Stuffed Crust", "Cheesy Bites"]
    },
    searchable: true,
    listable: true,
    individuallyBuyable: true,
    isNew: true,
    isDeployed: false
  },
  {
    id: "3",
    name: "Hawaiian",
    category: "Pizza",
    subCategory: "Classic Pizzas",
    price: 35.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Chicken ham and juicy pineapple chunks",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Classic"],
    variants: {
      size: ["Regular", "Large", "Extra Large"],
      crust: ["Pan", "Stuffed Crust", "Cheesy Bites"]
    },
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "4",
    name: "Beef Pepperoni",
    category: "Pizza",
    subCategory: "Classic Pizzas",
    price: 38.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Beef pepperoni and 100% mozzarella cheese",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Classic", "Popular"],
    variants: {
      size: ["Regular", "Large", "Extra Large"],
      crust: ["Pan", "Stuffed Crust", "Cheesy Bites"]
    },
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "5",
    name: "Meat Galore",
    category: "Pizza",
    subCategory: "Signature Pizzas",
    price: 44.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Chicken ham, beef pepperoni, minced beef and beef cabanossi sausages",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Meat Lovers"],
    variants: {
      size: ["Regular", "Large", "Extra Large"],
      crust: ["Pan", "Stuffed Crust", "Cheesy Bites"]
    },
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "6",
    name: "Veggie Lover's",
    category: "Pizza",
    subCategory: "Vegetarian",
    price: 36.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Fresh mushrooms, onions, olives, capsicums, pineapple chunks and diced tomatoes",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Vegetarian"],
    variants: {
      size: ["Regular", "Large", "Extra Large"],
      crust: ["Pan", "Stuffed Crust", "Cheesy Bites"]
    },
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "7",
    name: "Chicken Carbonara",
    category: "Pasta",
    price: 18.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Creamy carbonara sauce with grilled chicken chunks",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Pasta"],
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "8",
    name: "Beef Bolognese",
    category: "Pasta",
    price: 18.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Rich meat sauce with herbs and spices",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Pasta"],
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "9",
    name: "Chicken Wings (6pcs)",
    category: "WingStreet",
    price: 15.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Crispy chicken wings with choice of sauce",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Wings"],
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "10",
    name: "Chicken Drumlets (6pcs)",
    category: "WingStreet",
    price: 15.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Tender chicken drumlets with choice of sauce",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Wings"],
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "11",
    name: "Cheesy Bites",
    category: "Sides",
    price: 12.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Cheese-filled dough bites with marinara sauce",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Sides"],
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "12",
    name: "Garlic Bread",
    category: "Sides",
    price: 8.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Fresh baked garlic bread with herbs",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Sides"],
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "13",
    name: "Soup of the Day",
    category: "Sides",
    price: 7.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Chef's special soup served with bread",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Sides"],
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "14",
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 12.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Desserts"],
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "15",
    name: "Tiramisu",
    category: "Desserts",
    price: 11.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Classic Italian dessert with coffee-soaked ladyfingers",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Desserts"],
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "16",
    name: "Pepsi (Regular)",
    category: "Beverages",
    price: 4.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Chilled Pepsi soft drink",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Beverages"],
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "17",
    name: "7UP (Regular)",
    category: "Beverages",
    price: 4.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "Refreshing lemon-lime soda",
    discontinued: false,
    productType: "ala-carte",
    tags: ["Beverages"],
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "18",
    name: "Big Box Meal",
    category: "Combos",
    price: 24.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "1 Regular Pizza + 6pcs Wings + 1 Garlic Bread + 2 Drinks",
    discontinued: false,
    productType: "combo",
    comboConstruct: "1 Regular Pizza + 6pcs Wings + 1 Garlic Bread + 2 Drinks",
    tags: ["Combo", "Popular"],
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "19",
    name: "Family Box",
    category: "Combos",
    price: 59.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "2 Large Pizzas + 12pcs Wings + 2 Sides + 4 Drinks",
    discontinued: false,
    productType: "combo",
    comboConstruct: "2 Large Pizzas + 12pcs Wings + 2 Sides + 4 Drinks",
    tags: ["Combo", "Family Size"],
    searchable: true,
    listable: true,
    individuallyBuyable: true
  },
  {
    id: "20",
    name: "Personal Pan Combo",
    category: "Combos",
    price: 16.90,
    deliveryAvailable: true,
    takeawayAvailable: true,
    description: "1 Personal Pizza + 1 Side + 1 Drink",
    discontinued: false,
    productType: "combo",
    comboConstruct: "1 Personal Pizza + 1 Side + 1 Drink",
    tags: ["Combo", "Solo Meal"],
    searchable: true,
    listable: true,
    individuallyBuyable: true
  }
];

interface ProductManagementProps {
  storeChannels: {
    delivery: boolean;
    takeaway: boolean;
  };
  onHasChanges: (hasChanges: boolean) => void;
}

const ProductManagement = ({ storeChannels, onHasChanges }: ProductManagementProps) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [deploymentFilter, setDeploymentFilter] = useState<"all" | "deployed" | "not-deployed">("all");

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDeploymentFilter = true;
    if (deploymentFilter === "deployed") {
      matchesDeploymentFilter = product.isDeployed === true;
    } else if (deploymentFilter === "not-deployed") {
      matchesDeploymentFilter = product.isDeployed === false || product.isDeployed === undefined;
    }
    
    return matchesSearch && matchesDeploymentFilter;
  });

  const toggleProductSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const selectAllProducts = () => {
    setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
  };

  const deselectAllProducts = () => {
    setSelectedProducts(new Set());
  };

  const applyBulkAction = (channel: 'delivery' | 'takeaway' | 'both' | 'discontinue', enable: boolean) => {
    setProducts(products.map(product => {
      if (!selectedProducts.has(product.id)) return product;
      
      if (channel === 'discontinue') {
        return {
          ...product,
          discontinued: enable
        };
      } else if (channel === 'both') {
        return {
          ...product,
          deliveryAvailable: enable,
          takeawayAvailable: enable
        };
      } else if (channel === 'delivery') {
        return {
          ...product,
          deliveryAvailable: enable
        };
      } else {
        return {
          ...product,
          takeawayAvailable: enable
        };
      }
    }));
    
    onHasChanges(true);
    
    let actionMessage = '';
    let actionTitle = 'Bulk Action Applied';
    
    if (channel === 'discontinue') {
      actionTitle = enable ? 'Products Discontinued' : 'Products Reactivated';
      actionMessage = `${selectedProducts.size} product${selectedProducts.size > 1 ? 's' : ''} ${enable ? 'discontinued' : 'reactivated'}. Don't forget to click "Save Changes" to apply these changes.`;
    } else {
      actionTitle = `${channel.charAt(0).toUpperCase() + channel.slice(1)} ${enable ? 'Enabled' : 'Disabled'}`;
      actionMessage = `${enable ? 'Enabled' : 'Disabled'} ${channel} for ${selectedProducts.size} product${selectedProducts.size > 1 ? 's' : ''}. Click "Save Changes" to apply these changes.`;
    }
    
    toast({
      title: actionTitle,
      description: actionMessage,
      duration: 5000,
    });
    
    setBulkActionMode(false);
    setSelectedProducts(new Set());
  };

  const cancelBulkAction = () => {
    setBulkActionMode(false);
    setSelectedProducts(new Set());
  };

  const updateProductAvailability = (productId: string, channel: 'delivery' | 'takeaway', available: boolean) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { 
            ...product, 
            [channel === 'delivery' ? 'deliveryAvailable' : 'takeawayAvailable']: available 
          }
        : product
    ));
    onHasChanges(true);
  };

  const toggleBulkAvailability = (available: boolean) => {
    setProducts(products.map(product => ({
      ...product,
      deliveryAvailable: available,
      takeawayAvailable: available
    })));
    onHasChanges(true);
  };

  const updateProductMasterAvailability = (productId: string, available: boolean) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { 
            ...product, 
            deliveryAvailable: available,
            takeawayAvailable: available
          }
        : product
    ));
    onHasChanges(true);
  };

  const updateProductDiscontinuation = (productId: string, discontinued: boolean) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, discontinued }
        : product
    ));
    onHasChanges(true);
  };


  const getAvailabilityBadge = (product: Product) => {
    if (product.discontinued) {
      return <Badge variant="destructive">Discontinued</Badge>;
    }
    if (product.deliveryAvailable && product.takeawayAvailable) {
      return <Badge variant="default" className="bg-success text-success-foreground">Available</Badge>;
    }
    if (product.deliveryAvailable || product.takeawayAvailable) {
      return <Badge variant="secondary" className="bg-warning text-warning-foreground">Partial</Badge>;
    }
    return <Badge variant="destructive">Unavailable</Badge>;
  };

  const getProductTypeBadge = (product: Product) => {
    const typeConfig = {
      'combo': { label: 'Combo', className: 'bg-primary/10 text-primary border-primary/20' },
      'ala-carte': { label: 'Ala Carte', className: 'bg-secondary/50 text-secondary-foreground' },
      'topping': { label: 'Topping', className: 'bg-accent/50 text-accent-foreground' },
      'gift': { label: 'Gift Item', className: 'bg-success/10 text-success border-success/20' }
    };
    
    const config = typeConfig[product.productType];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

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
  } = usePagination(filteredProducts);

  return (
    <div className="space-y-6">

      {/* Search and Bulk Actions */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {!bulkActionMode ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Quick actions:</span>
              <Button
                variant="default"
                size="sm"
                onClick={() => setBulkActionMode(true)}
              >
                Bulk Edit
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={deploymentFilter} onValueChange={(value: "all" | "deployed" | "not-deployed") => setDeploymentFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                  <SelectItem value="not-deployed">Not Deployed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-lg">
                      {selectedProducts.size} selected
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllProducts}
                    >
                      Select All ({filteredProducts.length})
                    </Button>
                    {selectedProducts.size > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={deselectAllProducts}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {selectedProducts.size > 0 && (
                    <Select onValueChange={(value) => {
                      const [channel, action] = value.split('-') as [('delivery' | 'takeaway' | 'both' | 'discontinue'), ('enable' | 'disable')];
                      applyBulkAction(channel, action === 'enable');
                    }}>
                      <SelectTrigger className="w-[220px] bg-background">
                        <SelectValue placeholder="Choose action..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delivery-enable">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-success" />
                            <span>Enable Delivery</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="delivery-disable">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-destructive" />
                            <span>Disable Delivery</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="takeaway-enable">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-success" />
                            <span>Enable Takeaway</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="takeaway-disable">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-destructive" />
                            <span>Disable Takeaway</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="both-enable">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-success" />
                            <span>Enable Both Channels</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="both-disable">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-destructive" />
                            <span>Disable Both Channels</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="discontinue-enable">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-destructive" />
                            <span>Discontinue Products</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="discontinue-disable">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-success" />
                            <span>Reactivate Products</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelBulkAction}
                  >
                    Done
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid gap-4">
        {paginatedData.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Checkbox for bulk selection */}
                {bulkActionMode && (
                  <div className="flex items-center pt-1">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                  </div>
                )}
                
                <div className="flex-1 space-y-4">
                  {/* Product Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        {!product.isDeployed && (
                          <Badge variant="secondary">Not Deployed</Badge>
                        )}
                        {getAvailabilityBadge(product)}
                        {getProductTypeBadge(product)}
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{product.description}</p>
                      {product.productType === 'combo' && product.comboConstruct && (
                        <p className="text-xs bg-primary/10 text-primary px-2 py-1 rounded mb-2 inline-block">
                          {product.comboConstruct}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-6">
                      {/* Discontinuation Toggle */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 min-w-[110px]">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Discontinue</span>
                        </div>
                        <Switch
                          checked={product.discontinued}
                          onCheckedChange={(checked) => 
                            updateProductDiscontinuation(product.id, checked)
                          }
                        />
                      </div>

                      {!product.discontinued && (
                        <>
                          {/* Individual Channel Controls */}
                          {storeChannels.delivery && (
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 min-w-[110px]">
                                <Truck className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">Delivery</span>
                              </div>
                              <Switch
                                checked={product.deliveryAvailable}
                                onCheckedChange={(checked) => 
                                  updateProductAvailability(product.id, 'delivery', checked)
                                }
                              />
                            </div>
                          )}
                          
                          {storeChannels.takeaway && (
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 min-w-[110px]">
                                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">Takeaway</span>
                              </div>
                              <Switch
                                checked={product.takeawayAvailable}
                                onCheckedChange={(checked) => 
                                  updateProductAvailability(product.id, 'takeaway', checked)
                                }
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
  );
};

export default ProductManagement;