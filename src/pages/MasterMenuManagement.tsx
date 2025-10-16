import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductManagement from "@/components/ProductManagement";
import IngredientManagement from "@/components/IngredientManagement";

const MasterMenuManagement = () => {
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isAddIngredientDialogOpen, setIsAddIngredientDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<{
    name: string;
    category: string;
    price: string;
    description: string;
    productType: "ala-carte" | "combo";
  }>({
    name: "",
    category: "",
    price: "",
    description: "",
    productType: "ala-carte",
  });
  
  const [newIngredient, setNewIngredient] = useState<{
    name: string;
    category: string;
    unit: string;
    stockLevel: string;
    reorderPoint: string;
  }>({
    name: "",
    category: "",
    unit: "",
    stockLevel: "",
    reorderPoint: "",
  });

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Master menu changes have been applied to all restaurants.",
    });
    setHasChanges(false);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added to the master product list.`,
    });
    
    setIsAddProductDialogOpen(false);
    setNewProduct({
      name: "",
      category: "",
      price: "",
      description: "",
      productType: "ala-carte",
    });
    setHasChanges(true);
  };

  const handleAddIngredient = () => {
    if (!newIngredient.name || !newIngredient.category || !newIngredient.unit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Ingredient Added",
      description: `${newIngredient.name} has been added to the ingredients list.`,
    });
    
    setIsAddIngredientDialogOpen(false);
    setNewIngredient({
      name: "",
      category: "",
      unit: "",
      stockLevel: "",
      reorderPoint: "",
    });
    setHasChanges(true);
  };

  const handleAddClick = () => {
    if (activeTab === "products") {
      setIsAddProductDialogOpen(true);
    } else {
      setIsAddIngredientDialogOpen(true);
    }
  };

  // Mock store channels - in a real app, this would affect all stores
  const storeChannels = {
    delivery: true,
    takeaway: true,
    curbside: true,
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background pb-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Master Menu Management</h1>
            <p className="text-muted-foreground mt-2">
              Centrally manage products and ingredients across all restaurants
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleAddClick}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
            <Button 
              onClick={handleSaveChanges} 
              disabled={!hasChanges}
              className={`flex items-center gap-2 ${hasChanges ? 'animate-pulse bg-primary shadow-lg' : ''}`}
            >
              <Save className="w-4 h-4" />
              Save Changes
              {hasChanges && <span className="ml-1 px-2 py-0.5 bg-primary-foreground text-primary rounded-full text-xs font-bold">!</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <ProductManagement 
              storeChannels={storeChannels}
              onHasChanges={setHasChanges}
            />
          </TabsContent>

          <TabsContent value="ingredients" className="space-y-6">
            <IngredientManagement 
              storeChannels={storeChannels}
              onHasChanges={setHasChanges}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add New Product Dialog */}
      <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Add a new product to the master product list
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  placeholder="e.g., Margherita Pizza"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pizza">Pizza</SelectItem>
                    <SelectItem value="Pasta">Pasta</SelectItem>
                    <SelectItem value="Sides">Sides</SelectItem>
                    <SelectItem value="Desserts">Desserts</SelectItem>
                    <SelectItem value="Beverages">Beverages</SelectItem>
                    <SelectItem value="Combos">Combos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productType">Product Type *</Label>
                <Select
                  value={newProduct.productType}
                  onValueChange={(value: "ala-carte" | "combo") => setNewProduct({ ...newProduct, productType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ala-carte">Ala Carte</SelectItem>
                    <SelectItem value="combo">Combo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Product description..."
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Ingredient Dialog */}
      <Dialog open={isAddIngredientDialogOpen} onOpenChange={setIsAddIngredientDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Ingredient</DialogTitle>
            <DialogDescription>
              Add a new ingredient to the master ingredients list
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ingredientName">Ingredient Name *</Label>
                <Input
                  id="ingredientName"
                  placeholder="e.g., Mozzarella Cheese"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ingredientCategory">Category *</Label>
                <Select
                  value={newIngredient.category}
                  onValueChange={(value) => setNewIngredient({ ...newIngredient, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dairy">Dairy</SelectItem>
                    <SelectItem value="Meat">Meat</SelectItem>
                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                    <SelectItem value="Grains">Grains</SelectItem>
                    <SelectItem value="Condiments">Condiments</SelectItem>
                    <SelectItem value="Spices">Spices</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select
                  value={newIngredient.unit}
                  onValueChange={(value) => setNewIngredient({ ...newIngredient, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="g">Grams (g)</SelectItem>
                    <SelectItem value="l">Liters (L)</SelectItem>
                    <SelectItem value="ml">Milliliters (mL)</SelectItem>
                    <SelectItem value="pcs">Pieces</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockLevel">Stock Level</Label>
                <Input
                  id="stockLevel"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={newIngredient.stockLevel}
                  onChange={(e) => setNewIngredient({ ...newIngredient, stockLevel: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorderPoint">Reorder Point</Label>
                <Input
                  id="reorderPoint"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={newIngredient.reorderPoint}
                  onChange={(e) => setNewIngredient({ ...newIngredient, reorderPoint: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddIngredientDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddIngredient}>
              Add Ingredient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MasterMenuManagement;
