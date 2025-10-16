import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Upload, X, Plus, Image as ImageIcon, Video, ChefHat } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductEnrichmentFormProps {
  productId: string;
  onHasChanges?: (hasChanges: boolean) => void;
  onAddChange?: (entry: { type: "product"; action: "created" | "updated" | "deleted"; itemName: string; description: string }) => void;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
}

interface IconIdentifier {
  id: string;
  name: string;
  icon: string;
}

interface Recipe {
  id: string;
  name: string;
}

const mockIdentifiers: IconIdentifier[] = [
  { id: "1", name: "Beef", icon: "🥩" },
  { id: "2", name: "Chicken", icon: "🍗" },
  { id: "3", name: "Spicy", icon: "🌶️" },
  { id: "4", name: "Vegetarian", icon: "🥬" },
  { id: "5", name: "Seafood", icon: "🦐" },
];

const mockRecipes: Recipe[] = [
  { id: "r1", name: "Margherita Pizza Base" },
  { id: "r2", name: "Supreme Pizza Base" },
  { id: "r3", name: "Chicken Carbonara Sauce" },
  { id: "r4", name: "Beef Bolognese Sauce" },
  { id: "r5", name: "Hawaiian Pizza Base" },
];

const ProductEnrichmentForm = ({ productId, onHasChanges, onAddChange }: ProductEnrichmentFormProps) => {
  const [formData, setFormData] = useState({
    title: "Margherita Pizza",
    description: "Classic tomato sauce, mozzarella, fresh basil on a perfectly baked crust",
    tags: ["Bestseller", "Vegetarian"],
    maxToppingsAlaCarte: 5,
    maxToppingsCombo: 3,
    soldSeparately: true,
    hiddenProduct: false,
    discontinued: false,
    selectedIdentifiers: ["3", "4"],
    productType: "ala-carte" as "ala-carte" | "combo",
    selectedRecipe: "r1",
  });

  const [media, setMedia] = useState<MediaItem[]>([
    { id: "1", type: "image", url: "/placeholder.svg", name: "product-1.jpg" },
    { id: "2", type: "image", url: "/placeholder.svg", name: "product-2.jpg" },
  ]);

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    onHasChanges?.(false);
  }, [productId]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onHasChanges?.(true);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleChange("tags", [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    handleChange("tags", formData.tags.filter(t => t !== tag));
  };

  const toggleIdentifier = (identifierId: string) => {
    const newIdentifiers = formData.selectedIdentifiers.includes(identifierId)
      ? formData.selectedIdentifiers.filter(id => id !== identifierId)
      : [...formData.selectedIdentifiers, identifierId];
    handleChange("selectedIdentifiers", newIdentifiers);
  };

  const handleRemoveMedia = (mediaId: string) => {
    setMedia(media.filter(m => m.id !== mediaId));
    onHasChanges?.(true);
  };

  return (
    <Card className="h-[calc(100vh-250px)]">
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-370px)] pr-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Product Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter product title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>
            </div>

            <Separator />

            {/* Media Management */}
            <div className="space-y-3">
              <Label>Media (Photos & Videos)</Label>
              <div className="grid grid-cols-3 gap-3">
                {media.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-muted">
                      {item.type === 'image' ? (
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      ) : (
                        <Video className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveMedia(item.id)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{item.name}</p>
                  </div>
                ))}
                <button className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Upload</span>
                </button>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add new tag (e.g., Bestseller, Favourite)"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Icon Identifiers */}
            <div className="space-y-3">
              <Label>Icon Identifiers</Label>
              <div className="grid grid-cols-3 gap-2">
                {mockIdentifiers.map((identifier) => (
                  <button
                    key={identifier.id}
                    onClick={() => toggleIdentifier(identifier.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.selectedIdentifiers.includes(identifier.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="text-2xl mb-1">{identifier.icon}</div>
                    <div className="text-xs font-medium">{identifier.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Recipe Association - Only for A la Carte */}
            {formData.productType === "ala-carte" && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-muted-foreground" />
                    <Label>Recipe</Label>
                  </div>
                  <Select
                    value={formData.selectedRecipe}
                    onValueChange={(value) => handleChange("selectedRecipe", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a recipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRecipes.map((recipe) => (
                        <SelectItem key={recipe.id} value={recipe.id}>
                          {recipe.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Recipes define ingredients. When ingredients are unavailable, this product will be automatically disabled.
                  </p>
                </div>
                <Separator />
              </>
            )}

            {/* Topping Configuration */}
            <div className="space-y-4">
              <Label>Topping Limits</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxToppingsAlaCarte" className="text-sm text-muted-foreground">
                    Max Toppings (Ala Carte)
                  </Label>
                  <Input
                    id="maxToppingsAlaCarte"
                    type="number"
                    value={formData.maxToppingsAlaCarte}
                    onChange={(e) => handleChange("maxToppingsAlaCarte", parseInt(e.target.value))}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="maxToppingsCombo" className="text-sm text-muted-foreground">
                    Max Toppings (Combo)
                  </Label>
                  <Input
                    id="maxToppingsCombo"
                    type="number"
                    value={formData.maxToppingsCombo}
                    onChange={(e) => handleChange("maxToppingsCombo", parseInt(e.target.value))}
                    min="0"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Product Attributes */}
            <div className="space-y-4">
              <Label>Product Attributes</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="soldSeparately" className="text-sm font-normal">
                    Sold Separately
                  </Label>
                  <Switch
                    id="soldSeparately"
                    checked={formData.soldSeparately}
                    onCheckedChange={(checked) => handleChange("soldSeparately", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hiddenProduct" className="text-sm font-normal">
                    Hidden Product
                  </Label>
                  <Switch
                    id="hiddenProduct"
                    checked={formData.hiddenProduct}
                    onCheckedChange={(checked) => handleChange("hiddenProduct", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="discontinued" className="text-sm font-normal">
                    Discontinued
                  </Label>
                  <Switch
                    id="discontinued"
                    checked={formData.discontinued}
                    onCheckedChange={(checked) => handleChange("discontinued", checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProductEnrichmentForm;
