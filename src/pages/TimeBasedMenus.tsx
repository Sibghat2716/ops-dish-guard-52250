import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Plus, Edit, Trash2, Calendar, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls";

interface TimeBasedMenu {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  days: string[];
  cronExpression?: string;
  menuItems: string[];
  isActive: boolean;
}

const TimeBasedMenus = () => {
  const { toast } = useToast();
  const [timeBasedMenus, setTimeBasedMenus] = useState<TimeBasedMenu[]>([
    {
      id: "1",
      name: "Breakfast Special",
      description: "Morning breakfast menu",
      startTime: "06:00",
      endTime: "11:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      menuItems: ["Pancakes", "Omelette", "Coffee"],
      isActive: true,
    },
    {
      id: "2", 
      name: "Weekend Brunch",
      description: "Special weekend brunch items",
      startTime: "09:00",
      endTime: "15:00",
      days: ["Saturday", "Sunday"],
      menuItems: ["Eggs Benedict", "Avocado Toast", "Mimosa"],
      isActive: true,
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [newMenu, setNewMenu] = useState<Partial<TimeBasedMenu>>({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    days: [],
    cronExpression: "",
    menuItems: [],
    isActive: true,
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleDayToggle = (day: string) => {
    setNewMenu(prev => ({
      ...prev,
      days: prev.days?.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...(prev.days || []), day]
    }));
  };

  const handleCreateMenu = () => {
    if (!newMenu.name || !newMenu.startTime || !newMenu.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const menu: TimeBasedMenu = {
      id: Date.now().toString(),
      name: newMenu.name!,
      description: newMenu.description,
      startTime: newMenu.startTime!,
      endTime: newMenu.endTime!,
      days: newMenu.days || [],
      cronExpression: newMenu.cronExpression,
      menuItems: newMenu.menuItems || [],
      isActive: newMenu.isActive || true,
    };

    setTimeBasedMenus(prev => [...prev, menu]);
    setNewMenu({
      name: "",
      description: "",
      startTime: "",
      endTime: "",
      days: [],
      cronExpression: "",
      menuItems: [],
      isActive: true,
    });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Time-based menu created successfully",
    });
  };

  const handleDeleteMenu = (id: string) => {
    setTimeBasedMenus(prev => prev.filter(menu => menu.id !== id));
    toast({
      title: "Success",
      description: "Time-based menu deleted successfully",
    });
  };

  const toggleMenuStatus = (id: string) => {
    setTimeBasedMenus(prev => prev.map(menu => 
      menu.id === id ? { ...menu, isActive: !menu.isActive } : menu
    ));
  };

  const filteredMenus = useMemo(() => {
    return timeBasedMenus.filter(menu => {
      const matchesSearch = 
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" ||
        (statusFilter === "active" && menu.isActive) ||
        (statusFilter === "inactive" && !menu.isActive);
      
      return matchesSearch && matchesStatus;
    });
  }, [timeBasedMenus, searchQuery, statusFilter]);

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
  } = usePagination(filteredMenus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Based Menus</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage time-specific menu availability schedules
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Time Based Availability
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Time Based Menu</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Menu Name*</Label>
                  <Input
                    id="name"
                    value={newMenu.name}
                    onChange={(e) => setNewMenu(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Breakfast Special"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newMenu.description}
                    onChange={(e) => setNewMenu(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time*</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newMenu.startTime}
                    onChange={(e) => setNewMenu(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time*</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newMenu.endTime}
                    onChange={(e) => setNewMenu(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Days of Week</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={newMenu.days?.includes(day)}
                        onCheckedChange={() => handleDayToggle(day)}
                      />
                      <Label htmlFor={day} className="text-sm">
                        {day.slice(0, 3)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="cron">Advanced: Cron Expression</Label>
                <Input
                  id="cron"
                  value={newMenu.cronExpression}
                  onChange={(e) => setNewMenu(prev => ({ ...prev, cronExpression: e.target.value }))}
                  placeholder="e.g., 0 11-13 * * TUE (Tuesdays 11am-1pm)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Override days selection with custom cron for complex schedules
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateMenu}>
                  Create Menu
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search time-based menus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {paginatedData.map((menu) => (
          <Card key={menu.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {menu.name}
                    <Badge variant={menu.isActive ? "default" : "secondary"}>
                      {menu.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </CardTitle>
                  {menu.description && (
                    <CardDescription>{menu.description}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteMenu(menu.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Time</span>
                  </div>
                  <p className="text-sm">{menu.startTime} - {menu.endTime}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Days</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {menu.days.map((day) => (
                      <Badge key={day} variant="outline" className="text-xs">
                        {day.slice(0, 3)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Menu Items ({menu.menuItems.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {menu.menuItems.slice(0, 3).map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                    {menu.menuItems.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{menu.menuItems.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {menu.cronExpression && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Cron Expression: </span>
                  <code className="text-xs bg-background px-2 py-1 rounded">
                    {menu.cronExpression}
                  </code>
                </div>
              )}

              <div className="mt-4 flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleMenuStatus(menu.id)}
                >
                  {menu.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button size="sm">
                  Manage Menu Items
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {timeBasedMenus.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Time-Based Menus</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first time-based menu to manage availability schedules
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Menu
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {timeBasedMenus.length > 0 && (
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
      )}
    </div>
  );
};

export default TimeBasedMenus;