import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, X, ChefHat } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls";

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  usedInProducts: string[];
}

interface RecipeManagementProps {
  onHasChanges?: (hasChanges: boolean) => void;
  onAddChange?: (entry: { type: "recipe"; action: "created" | "updated" | "deleted"; itemName: string; description: string }) => void;
}

const mockRecipes: Recipe[] = [
  { 
    id: "r1", 
    name: "Margherita Pizza Base", 
    ingredients: ["Dough", "Tomato Sauce", "Mozzarella", "Basil"],
    usedInProducts: ["Margherita Pizza"]
  },
  { 
    id: "r2", 
    name: "Supreme Pizza Base", 
    ingredients: ["Dough", "Tomato Sauce", "Mozzarella", "Pepperoni", "Mushrooms", "Bell Peppers", "Onions"],
    usedInProducts: ["Super Supreme"]
  },
  { 
    id: "r3", 
    name: "Chicken Carbonara Sauce", 
    ingredients: ["Cream", "Parmesan", "Black Pepper", "Chicken"],
    usedInProducts: ["Chicken Carbonara"]
  },
  { 
    id: "r4", 
    name: "Beef Bolognese Sauce", 
    ingredients: ["Ground Beef", "Tomato Sauce", "Onions", "Garlic", "Italian Herbs"],
    usedInProducts: ["Beef Bolognese"]
  },
  { 
    id: "r5", 
    name: "Hawaiian Pizza Base", 
    ingredients: ["Dough", "Tomato Sauce", "Mozzarella", "Ham", "Pineapple"],
    usedInProducts: ["Hawaiian Pizza"]
  },
  { 
    id: "r6", 
    name: "Buffalo Wings Marinade", 
    ingredients: ["Hot Sauce", "Butter", "Vinegar", "Garlic Powder"],
    usedInProducts: ["Buffalo Wings"]
  },
  { 
    id: "r7", 
    name: "Caesar Dressing", 
    ingredients: ["Mayonnaise", "Parmesan", "Lemon Juice", "Garlic", "Anchovies"],
    usedInProducts: ["Caesar Salad"]
  },
  { 
    id: "r8", 
    name: "BBQ Sauce", 
    ingredients: ["Ketchup", "Brown Sugar", "Vinegar", "Worcestershire Sauce", "Spices"],
    usedInProducts: ["BBQ Chicken Pizza", "BBQ Wings"]
  },
  { 
    id: "r9", 
    name: "Garlic Bread Spread", 
    ingredients: ["Butter", "Garlic", "Parsley", "Salt"],
    usedInProducts: ["Garlic Bread"]
  },
  { 
    id: "r10", 
    name: "Pesto Sauce", 
    ingredients: ["Basil", "Pine Nuts", "Parmesan", "Olive Oil", "Garlic"],
    usedInProducts: ["Pesto Pasta", "Pesto Pizza"]
  },
  { 
    id: "r11", 
    name: "Alfredo Sauce", 
    ingredients: ["Heavy Cream", "Butter", "Parmesan", "Garlic"],
    usedInProducts: ["Chicken Alfredo"]
  },
  { 
    id: "r12", 
    name: "Marinara Sauce", 
    ingredients: ["Tomatoes", "Garlic", "Olive Oil", "Basil", "Oregano"],
    usedInProducts: ["Spaghetti Marinara", "Mozzarella Sticks"]
  },
];

const RecipeManagement = ({ onHasChanges, onAddChange }: RecipeManagementProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
  } = usePagination(filteredRecipes);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-4">
        <Card className="h-[calc(100vh-250px)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              Recipes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create New Recipe
            </Button>

            <Separator />

            <ScrollArea className="h-[calc(100vh-450px)]">
              <div className="space-y-2">
                {paginatedData.map((recipe) => (
                  <Card
                    key={recipe.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedRecipe?.id === recipe.id ? "border-primary ring-2 ring-primary/20" : ""
                    }`}
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm mb-1">{recipe.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {recipe.ingredients.length} ingredients
                      </p>
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {recipe.usedInProducts.length} products
                        </Badge>
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
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-8">
        {selectedRecipe ? (
          <Card className="h-[calc(100vh-250px)]">
            <CardHeader>
              <CardTitle>Recipe Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-370px)]">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium">Recipe Name</label>
                    <Input value={selectedRecipe.name} className="mt-2" />
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium mb-3 block">Ingredients</label>
                    <div className="space-y-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={ingredient} readOnly />
                          <Button variant="ghost" size="icon">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Ingredient
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium mb-3 block">Used in Products</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecipe.usedInProducts.map((product, index) => (
                        <Badge key={index} variant="secondary">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <div className="h-[calc(100vh-250px)] flex items-center justify-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Select a recipe to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeManagement;
