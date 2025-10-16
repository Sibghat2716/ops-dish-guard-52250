import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls";

interface IconIdentifier {
  id: string;
  name: string;
  icon: string;
}

interface IconIdentifierManagementProps {
  onHasChanges?: (hasChanges: boolean) => void;
  onAddChange?: (entry: { type: "identifier"; action: "created" | "updated" | "deleted"; itemName: string; description: string }) => void;
}

const IconIdentifierManagement = ({ onHasChanges, onAddChange }: IconIdentifierManagementProps) => {
  const [identifiers, setIdentifiers] = useState<IconIdentifier[]>([
    { id: "1", name: "Beef", icon: "🥩" },
    { id: "2", name: "Chicken", icon: "🍗" },
    { id: "3", name: "Spicy", icon: "🌶️" },
    { id: "4", name: "Vegetarian", icon: "🥬" },
    { id: "5", name: "Seafood", icon: "🦐" },
    { id: "6", name: "Halal", icon: "☪️" },
    { id: "7", name: "Gluten Free", icon: "🌾" },
    { id: "8", name: "Dairy Free", icon: "🥛" },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", icon: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIdentifiers = identifiers.filter(identifier =>
    identifier.name.toLowerCase().includes(searchQuery.toLowerCase())
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
  } = usePagination(filteredIdentifiers);

  const handleOpenDialog = (identifier?: IconIdentifier) => {
    if (identifier) {
      setEditingId(identifier.id);
      setFormData({ name: identifier.name, icon: identifier.icon });
    } else {
      setEditingId(null);
      setFormData({ name: "", icon: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setIdentifiers(identifiers.map(item => 
        item.id === editingId ? { ...item, ...formData } : item
      ));
      if (onAddChange) {
        onAddChange({
          type: "identifier",
          action: "updated",
          itemName: formData.name,
          description: `Updated icon identifier ${formData.name}`,
        });
      }
    } else {
      setIdentifiers([...identifiers, { 
        id: Date.now().toString(), 
        ...formData 
      }]);
      if (onAddChange) {
        onAddChange({
          type: "identifier",
          action: "created",
          itemName: formData.name,
          description: `Created new icon identifier ${formData.name}`,
        });
      }
    }
    onHasChanges?.(true);
    setIsDialogOpen(false);
    setFormData({ name: "", icon: "" });
  };

  const handleDelete = (id: string) => {
    const identifier = identifiers.find(item => item.id === id);
    setIdentifiers(identifiers.filter(item => item.id !== id));
    onHasChanges?.(true);
    
    if (onAddChange && identifier) {
      onAddChange({
        type: "identifier",
        action: "deleted",
        itemName: identifier.name,
        description: `Deleted icon identifier ${identifier.name}`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Icon Identifiers</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Identifier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit" : "Add"} Icon Identifier
                </DialogTitle>
                <DialogDescription>
                  Create visual identifiers for product attributes like beef, chicken, spicy, etc.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Beef, Chicken, Spicy"
                  />
                </div>
                <div>
                  <Label htmlFor="icon">Emoji/Icon</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g., 🥩, 🍗, 🌶️"
                    className="text-2xl"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={!formData.name || !formData.icon}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search identifiers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {paginatedData.map((identifier) => (
            <Card key={identifier.id} className="relative group">
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">{identifier.icon}</div>
                <p className="font-medium text-sm">{identifier.name}</p>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={() => handleOpenDialog(identifier)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(identifier.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
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
      </CardContent>
    </Card>
  );
};

export default IconIdentifierManagement;
