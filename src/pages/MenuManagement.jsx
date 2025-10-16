import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Grid3x3, Leaf, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductManagement from "@/components/ProductManagement";
import IngredientManagement from "@/components/IngredientManagement";
import CategoriesManagement from "@/components/CategoriesManagement";

import { useToast } from "@/hooks/use-toast";

const MenuManagement = ({ selectedStore, storeChannels }) => {
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "All menu changes have been saved successfully.",
    });
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage products, categories, and ingredients
          </p>
        </div>
        <Button 
          onClick={handleSaveChanges} 
          disabled={!hasChanges}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Grid3x3 className="w-4 h-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="ingredients" className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Ingredients
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductManagement 
            storeChannels={storeChannels}
            onHasChanges={setHasChanges}
          />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesManagement onHasChanges={setHasChanges} />
        </TabsContent>

        <TabsContent value="ingredients">
          <IngredientManagement 
            storeChannels={storeChannels}
            onHasChanges={setHasChanges}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuManagement;
