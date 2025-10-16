import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDeployment } from "@/contexts/DeploymentContext";
import ProductCatalog from "@/components/ProductCatalog";
import ProductEnrichmentForm from "@/components/ProductEnrichmentForm";
import IconIdentifierManagement from "@/components/IconIdentifierManagement";
import RecipeManagement from "@/components/RecipeManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductEnrichmentPage = () => {
  const { toast } = useToast();
  const { addChange } = useDeployment();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSaveChanges = () => {
    if (selectedProduct) {
      addChange({
        type: "product",
        action: "updated",
        itemName: selectedProduct,
        description: `Updated product enrichment`,
      });
    }
    setHasUnsavedChanges(false);
    toast({
      title: "Changes Saved",
      description: "Your changes have been saved. Go to Deploy to make them live.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Enrichment</h1>
          <p className="text-muted-foreground mt-2">
            Manage product information, media, tags, and attributes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSaveChanges}
            disabled={!hasUnsavedChanges}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="catalog" className="space-y-6">
        <TabsList>
          <TabsTrigger value="catalog">Product Catalog</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="identifiers">Icon Identifiers</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4">
              <ProductCatalog 
                onSelectProduct={setSelectedProduct}
                selectedProductId={selectedProduct}
              />
            </div>
            <div className="col-span-8">
              {selectedProduct ? (
                <ProductEnrichmentForm 
                  productId={selectedProduct}
                  onHasChanges={setHasUnsavedChanges}
                />
              ) : (
                <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg min-h-[500px]">
                  <p className="text-muted-foreground">Select a product to enrich</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recipes">
          <RecipeManagement onAddChange={addChange} />
        </TabsContent>

        <TabsContent value="identifiers">
          <IconIdentifierManagement onAddChange={addChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductEnrichmentPage;
