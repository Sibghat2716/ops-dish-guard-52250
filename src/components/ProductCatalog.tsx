import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls";

interface Product {
  id: string;
  name: string;
  category: string;
  productType: 'combo' | 'ala-carte';
  price: number;
  discontinued: boolean;
  isNew?: boolean;
  isDeployed?: boolean;
}

const mockProducts: Product[] = [
  { id: "1", name: "Super Supreme", category: "Pizza", productType: "ala-carte", price: 42.90, discontinued: false, isNew: true, isDeployed: false },
  { id: "2", name: "Chicken Supreme", category: "Pizza", productType: "ala-carte", price: 40.90, discontinued: false, isNew: true, isDeployed: false },
  { id: "3", name: "Hawaiian", category: "Pizza", productType: "ala-carte", price: 35.90, discontinued: false },
  { id: "4", name: "Beef Pepperoni", category: "Pizza", productType: "ala-carte", price: 38.90, discontinued: false },
  { id: "5", name: "Meat Galore", category: "Pizza", productType: "ala-carte", price: 44.90, discontinued: false },
  { id: "6", name: "Veggie Lover's", category: "Pizza", productType: "ala-carte", price: 36.90, discontinued: false },
  { id: "7", name: "Chicken Carbonara", category: "Pasta", productType: "ala-carte", price: 18.90, discontinued: false },
  { id: "8", name: "Beef Bolognese", category: "Pasta", productType: "ala-carte", price: 18.90, discontinued: false },
  { id: "9", name: "Chicken Wings (6pcs)", category: "WingStreet", productType: "ala-carte", price: 15.90, discontinued: false },
  { id: "10", name: "Chicken Drumlets (6pcs)", category: "WingStreet", productType: "ala-carte", price: 15.90, discontinued: false },
  { id: "11", name: "Cheesy Bites", category: "Sides", productType: "ala-carte", price: 12.90, discontinued: false },
  { id: "12", name: "Garlic Bread", category: "Sides", productType: "ala-carte", price: 8.90, discontinued: false },
  { id: "13", name: "Soup of the Day", category: "Sides", productType: "ala-carte", price: 7.90, discontinued: false },
  { id: "14", name: "Chocolate Lava Cake", category: "Desserts", productType: "ala-carte", price: 12.90, discontinued: false },
  { id: "15", name: "Tiramisu", category: "Desserts", productType: "ala-carte", price: 11.90, discontinued: false },
  { id: "16", name: "Pepsi (Regular)", category: "Beverages", productType: "ala-carte", price: 4.90, discontinued: false },
  { id: "17", name: "7UP (Regular)", category: "Beverages", productType: "ala-carte", price: 4.90, discontinued: false },
  { id: "18", name: "Big Box Meal", category: "Combos", productType: "combo", price: 24.90, discontinued: false },
  { id: "19", name: "Family Box", category: "Combos", productType: "combo", price: 59.90, discontinued: false },
  { id: "20", name: "Personal Pan Combo", category: "Combos", productType: "combo", price: 16.90, discontinued: false },
];

const categories = [
  "All",
  "Pizza",
  "Combos",
  "Pasta",
  "WingStreet",
  "Sides",
  "Desserts",
  "Beverages"
];

interface ProductCatalogProps {
  onSelectProduct: (productId: string) => void;
  selectedProductId: string | null;
}

const ProductCatalog = ({ onSelectProduct, selectedProductId }: ProductCatalogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
  } = usePagination(filteredProducts);

  const getProductTypeBadge = (type: string) => {
    return type === 'combo' 
      ? <Badge variant="outline" className="bg-primary/10 text-primary">Combo</Badge>
      : null;
  };

  return (
    <Card className="h-[calc(100vh-250px)]">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="space-y-4 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="inline-flex w-max">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="text-xs"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          </Tabs>
        </div>

        <ScrollArea className="flex-1 mt-4 -mx-4 px-4">
          <div className="space-y-2">
            {paginatedData.map((product) => (
              <Card
                key={product.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedProductId === product.id && "border-primary ring-2 ring-primary/20"
                )}
                onClick={() => onSelectProduct(product.id)}
              >
                <CardContent className="p-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{product.name}</h4>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="flex gap-1 items-center flex-shrink-0">
                      {!product.isDeployed && (
                        <Badge variant="secondary" className="text-xs">Not Deployed</Badge>
                      )}
                      {getProductTypeBadge(product.productType)}
                      {product.discontinued && (
                        <Badge variant="destructive" className="text-xs">Discontinued</Badge>
                      )}
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProductCatalog;
