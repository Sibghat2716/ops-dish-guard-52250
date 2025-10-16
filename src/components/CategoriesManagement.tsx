import { useState } from "react";
import { Plus, Edit2, Trash2, FolderTree, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls";

interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  itemCount: number;
}

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Pizza",
    subCategories: [
      { id: "1-1", name: "Vegetarian", itemCount: 5 },
      { id: "1-2", name: "Non-Vegetarian", itemCount: 7 },
      { id: "1-3", name: "Specialty", itemCount: 4 }
    ]
  },
  {
    id: "2",
    name: "Pasta",
    subCategories: [
      { id: "2-1", name: "Red Sauce", itemCount: 3 },
      { id: "2-2", name: "White Sauce", itemCount: 4 }
    ]
  },
  {
    id: "3",
    name: "Beverages",
    subCategories: [
      { id: "3-1", name: "Cold Drinks", itemCount: 8 },
      { id: "3-2", name: "Hot Drinks", itemCount: 5 }
    ]
  }
];

interface CategoriesManagementProps {
  onHasChanges: (hasChanges: boolean) => void;
}

const CategoriesManagement = ({ onHasChanges }: CategoriesManagementProps) => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSubCategory, setIsAddingSubCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.subCategories.some(sub => 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
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
  } = usePagination(filteredCategories);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      subCategories: []
    };
    
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setIsAddingCategory(false);
    onHasChanges(true);
  };

  const handleAddSubCategory = () => {
    if (!newSubCategoryName.trim() || !selectedCategoryId) return;
    
    const newSubCategory: SubCategory = {
      id: `${selectedCategoryId}-${Date.now()}`,
      name: newSubCategoryName,
      itemCount: 0
    };
    
    setCategories(categories.map(cat => 
      cat.id === selectedCategoryId
        ? { ...cat, subCategories: [...cat.subCategories, newSubCategory] }
        : cat
    ));
    
    setNewSubCategoryName("");
    setIsAddingSubCategory(false);
    setSelectedCategoryId("");
    onHasChanges(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    onHasChanges(true);
  };

  const handleDeleteSubCategory = (categoryId: string, subCategoryId: string) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, subCategories: cat.subCategories.filter(sub => sub.id !== subCategoryId) }
        : cat
    ));
    onHasChanges(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Categories & Sub-Categories</h2>
          <p className="text-muted-foreground text-sm">Organize your menu items into categories</p>
        </div>
        <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  placeholder="e.g., Desserts"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <Button onClick={handleAddCategory} className="w-full">
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {paginatedData.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FolderTree className="w-5 h-5 text-primary" />
                  <CardTitle>{category.name}</CardTitle>
                  <Badge variant="secondary">
                    {category.subCategories.length} sub-categories
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={isAddingSubCategory && selectedCategoryId === category.id} onOpenChange={(open) => {
                    setIsAddingSubCategory(open);
                    if (!open) setSelectedCategoryId("");
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCategoryId(category.id)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Sub-Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Sub-Category to {category.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="subcategory-name">Sub-Category Name</Label>
                          <Input
                            id="subcategory-name"
                            placeholder="e.g., Ice Cream"
                            value={newSubCategoryName}
                            onChange={(e) => setNewSubCategoryName(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleAddSubCategory} className="w-full">
                          Add Sub-Category
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {category.subCategories.length > 0 ? (
                <div className="grid gap-2">
                  {category.subCategories.map((subCategory) => (
                    <div
                      key={subCategory.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{subCategory.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {subCategory.itemCount} items
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteSubCategory(category.id, subCategory.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No sub-categories yet. Add one to get started.
                </p>
              )}
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

export default CategoriesManagement;
