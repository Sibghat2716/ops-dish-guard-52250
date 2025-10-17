import { useState } from "react";
import { Search, AlertTriangle, Package2, Truck, ShoppingBag, ChefHat, Package, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls";

const mockIngredients = [
  {
    id: "1",
    name: "Fresh Mozzarella",
    category: "Dairy",
    available: true,
    deliveryAvailable: true,
    takeawayAvailable: true,
    impactedRecipes: ["Margherita Pizza Base", "Supreme Pizza Base"],
    impactedProducts: ["Margherita Pizza", "Caprese Salad", "Chicken Parmigiana"]
  },
  {
    id: "2",
    name: "Chicken Breast",
    category: "Protein",
    available: false,
    deliveryAvailable: false,
    takeawayAvailable: false,
    impactedRecipes: ["Chicken Carbonara Sauce", "Grilled Chicken Recipe"],
    impactedProducts: ["Chicken Caesar Salad", "Grilled Chicken Sandwich", "Chicken Parmigiana", "Chicken Wrap", "BBQ Chicken Pizza", "Chicken Fajita", "Chicken Tikka Masala", "Buffalo Chicken Wings", "Chicken Quesadilla", "Chicken Fried Rice"]
  },
  {
    id: "3",
    name: "Basil Leaves",
    category: "Herbs",
    available: true,
    deliveryAvailable: true,
    takeawayAvailable: true,
    impactedRecipes: ["Margherita Pizza Base", "Pasta Pesto Recipe"],
    impactedProducts: ["Margherita Pizza", "Pasta Pesto", "Caprese Salad"]
  },
  {
    id: "4",
    name: "Beef Patty",
    category: "Protein",
    available: true,
    deliveryAvailable: true,
    takeawayAvailable: true,
    impactedRecipes: ["Beef Burger Recipe", "Bolognese Sauce"],
    impactedProducts: ["Beef Burger Deluxe", "Bacon Cheeseburger"]
  },
  {
    id: "5",
    name: "Salmon Fillet",
    category: "Seafood",
    available: false,
    deliveryAvailable: false,
    takeawayAvailable: false,
    impactedRecipes: ["Grilled Salmon Recipe", "Salmon Sushi Recipe"],
    impactedProducts: ["Grilled Salmon", "Salmon Sushi Roll", "Salmon Teriyaki"]
  },
];

const IngredientManagement = ({ storeChannels, onHasChanges }) => {
  const [ingredients, setIngredients] = useState(mockIngredients);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showImpactPreview, setShowImpactPreview] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [impactPreviewPage, setImpactPreviewPage] = useState(1);

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ingredient.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || ingredient.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "available" && ingredient.available) ||
      (statusFilter === "unavailable" && !ingredient.available);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
  } = usePagination(filteredIngredients);

  const updateIngredientMasterAvailability = (ingredientId, available) => {
    setIngredients(ingredients.map(ingredient => 
      ingredient.id === ingredientId 
        ? { 
            ...ingredient, 
            available,
            deliveryAvailable: available,
            takeawayAvailable: available
          }
        : ingredient
    ));
    onHasChanges(true);
  };

  const updateIngredientChannelAvailability = (ingredientId, channel, available) => {
    setIngredients(ingredients.map(ingredient => 
      ingredient.id === ingredientId 
        ? { 
            ...ingredient, 
            [channel === 'delivery' ? 'deliveryAvailable' : 'takeawayAvailable']: available,
            available: channel === 'delivery' 
              ? available && ingredient.takeawayAvailable 
              : ingredient.deliveryAvailable && available
          }
        : ingredient
    ));
    onHasChanges(true);
  };

  const updateIngredientAvailability = (ingredientId, available) => {
    const ingredient = ingredients.find(ing => ing.id === ingredientId);
    if (ingredient && !available && ingredient.impactedProducts.length > 0) {
      setSelectedIngredient({ ...ingredient, available });
      setShowImpactPreview(true);
      setImpactPreviewPage(1);
    } else {
      setIngredients(ingredients.map(ing => 
        ing.id === ingredientId ? { ...ing, available } : ing
      ));
    }
  };

  const confirmIngredientUpdate = () => {
    if (selectedIngredient) {
      setIngredients(ingredients.map(ing => 
        ing.id === selectedIngredient.id ? selectedIngredient : ing
      ));
    }
    setShowImpactPreview(false);
    setSelectedIngredient(null);
    setImpactPreviewPage(1);
  };

  const cancelIngredientUpdate = () => {
    setShowImpactPreview(false);
    setSelectedIngredient(null);
    setImpactPreviewPage(1);
  };

  const toggleBulkAvailability = (available) => {
    setIngredients(ingredients.map(ingredient => ({
      ...ingredient,
      available,
      deliveryAvailable: available,
      takeawayAvailable: available
    })));
    onHasChanges(true);
  };

  const unavailableIngredients = ingredients.filter(ing => !ing.available);
  const totalImpactedProducts = unavailableIngredients.reduce((acc, ing) => {
    ing.impactedProducts.forEach(product => {
      if (!acc.includes(product)) acc.push(product);
    });
    return acc;
  }, []);

  return (
    <div className="space-y-6">

      {/* Search and Bulk Actions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Dairy">Dairy</SelectItem>
                <SelectItem value="Protein">Protein</SelectItem>
                <SelectItem value="Herbs">Herbs</SelectItem>
                <SelectItem value="Vegetables">Vegetables</SelectItem>
                <SelectItem value="Meat">Meat</SelectItem>
                <SelectItem value="Seafood">Seafood</SelectItem>
                <SelectItem value="Sauce">Sauce</SelectItem>
                <SelectItem value="Bread">Bread</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Bulk Actions:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleBulkAvailability(true)}
            className="text-success border-success/20 hover:bg-success/10"
          >
            Enable All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleBulkAvailability(false)}
            className="text-destructive border-destructive/20 hover:bg-destructive/10"
          >
            Disable All
          </Button>
        </div>
      </div>

      {/* Impact Preview Dialog */}
      {showImpactPreview && selectedIngredient && (
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-5 h-5" />
              Impact Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Marking <strong>{selectedIngredient.name}</strong> as unavailable will affect the following menu items:
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Affected Products ({selectedIngredient.impactedProducts.length})
                </h4>
                <div className="space-y-2">
                  {selectedIngredient.impactedProducts
                    .slice((impactPreviewPage - 1) * 5, impactPreviewPage * 5)
                    .map(product => (
                      <div key={product} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        <Package className="w-4 h-4 text-warning" />
                        <span className="text-sm font-medium">{product}</span>
                        <Badge variant="destructive" className="ml-auto text-xs">
                          Will be unavailable
                        </Badge>
                      </div>
                    ))}
                </div>
                
                {selectedIngredient.impactedProducts.length > 5 && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="text-xs text-muted-foreground">
                      Showing {((impactPreviewPage - 1) * 5) + 1}-{Math.min(impactPreviewPage * 5, selectedIngredient.impactedProducts.length)} of {selectedIngredient.impactedProducts.length}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setImpactPreviewPage(prev => Math.max(1, prev - 1))}
                        disabled={impactPreviewPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setImpactPreviewPage(prev => Math.min(Math.ceil(selectedIngredient.impactedProducts.length / 5), prev + 1))}
                        disabled={impactPreviewPage >= Math.ceil(selectedIngredient.impactedProducts.length / 5)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={confirmIngredientUpdate} variant="default">
                Continue
              </Button>
              <Button onClick={cancelIngredientUpdate} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ingredients Grid */}
      <div className="grid gap-4">
        {paginatedData.map((ingredient) => (
          <Card key={ingredient.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{ingredient.name}</h3>
                    <Badge variant="outline">{ingredient.category}</Badge>
                    {ingredient.available ? (
                      <Badge variant="default" className="bg-success text-success-foreground">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Unavailable</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Affects {ingredient.impactedProducts.length} menu items
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {ingredient.impactedProducts.slice(0, 3).map(product => (
                        <Badge key={product} variant="secondary" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                      {ingredient.impactedProducts.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{ingredient.impactedProducts.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 ml-6">
                  {/* Availability Toggle */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <Package2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Available</span>
                    </div>
                    <Switch
                      checked={ingredient.available}
                      onCheckedChange={(checked) => {
                        if (!checked) {
                          setSelectedIngredient(ingredient);
                          setShowImpactPreview(true);
                        } else {
                          updateIngredientMasterAvailability(ingredient.id, true);
                        }
                      }}
                    />
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

export default IngredientManagement;
