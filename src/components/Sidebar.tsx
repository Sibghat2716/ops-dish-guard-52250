import { useState, useEffect } from "react";
import { Utensils, Store, Clock, LayoutDashboard, ChevronDown, Sparkles, Package, List, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [adminOpen, setAdminOpen] = useState(false);
  const [masterListOpen, setMasterListOpen] = useState(false);
  const [enrichmentOpen, setEnrichmentOpen] = useState(false);

  // Auto-expand menus based on current path
  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      setAdminOpen(true);
      if (location.pathname.includes("/master-list") || location.pathname === "/admin") {
        setMasterListOpen(true);
      }
      if (location.pathname.includes("/enrichment")) {
        setEnrichmentOpen(true);
      }
    }
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (paths: string[]) => paths.some(path => location.pathname.startsWith(path));

  return (
    <div className={cn("w-64 bg-card border-r border-border h-screen overflow-y-auto lg:block hidden", className)}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Utensils className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">RestaurantOps</span>
        </div>
        
        <nav className="space-y-0.5">
          {/* Menu Management */}
          <button
            onClick={() => navigate("/")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all relative group",
              isActive("/")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive("/") && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-primary rounded-r" />
            )}
            <Utensils className="w-4 h-4 ml-1" />
            <span>Menu Management</span>
          </button>

          {/* Store Management */}
          <button
            onClick={() => navigate("/store-management")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all relative group",
              isActive("/store-management")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive("/store-management") && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-primary rounded-r" />
            )}
            <Store className="w-4 h-4 ml-1" />
            <span>Store Management</span>
          </button>

          {/* Time Based Menus */}
          <button
            onClick={() => navigate("/time-based-menus")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all relative group",
              isActive("/time-based-menus")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive("/time-based-menus") && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-primary rounded-r" />
            )}
            <Clock className="w-4 h-4 ml-1" />
            <span>Time Based Menus</span>
          </button>

          {/* Admin Dashboard - Collapsible */}
          <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
            <CollapsibleTrigger
              className={cn(
                "w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium transition-all relative group",
                isParentActive(["/admin"])
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isParentActive(["/admin"]) && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-primary rounded-r" />
              )}
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 ml-1" />
                <span>Admin Dashboard</span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform mr-1",
                  adminOpen && "transform rotate-180"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-0.5">
              <div className="relative">
                {/* Vertical line for submenu */}
                <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" />
                
                {/* Master List - Nested Collapsible */}
                <Collapsible open={masterListOpen} onOpenChange={setMasterListOpen}>
                  <CollapsibleTrigger
                    className={cn(
                      "w-full flex items-center justify-between gap-3 pl-8 pr-3 py-2 text-sm transition-all relative group",
                      (location.pathname.includes("/master-list") || location.pathname === "/admin")
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {(location.pathname.includes("/master-list") || location.pathname === "/admin") && (
                      <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full ring-4 ring-sidebar" />
                    )}
                    {!(location.pathname.includes("/master-list") || location.pathname === "/admin") && (
                      <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-border rounded-full" />
                    )}
                    <div className="flex items-center gap-2 ml-3">
                      <List className="w-4 h-4" />
                      <span>Master List</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform mr-1",
                        masterListOpen && "transform rotate-180"
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-0.5">
                    <div className="relative">
                      {/* Vertical line for nested submenu */}
                      <div className="absolute left-[42px] top-0 bottom-0 w-px bg-border" />
                      
                      {/* Stores */}
                      <button
                        onClick={() => navigate("/admin/master-list/stores")}
                        className={cn(
                          "w-full flex items-center gap-2 pl-14 pr-3 py-2 text-sm transition-all relative group",
                          isActive("/admin/master-list/stores")
                            ? "text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {isActive("/admin/master-list/stores") && (
                          <div className="absolute left-[42px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full ring-4 ring-sidebar" />
                        )}
                        {!isActive("/admin/master-list/stores") && (
                          <div className="absolute left-[42px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-border rounded-full" />
                        )}
                        <Store className="w-3.5 h-3.5 ml-2" />
                        <span>Stores</span>
                      </button>

                      {/* Products */}
                      <button
                        onClick={() => navigate("/admin/master-list/products")}
                        className={cn(
                          "w-full flex items-center gap-2 pl-14 pr-3 py-2 text-sm transition-all relative group",
                          isActive("/admin/master-list/products")
                            ? "text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {isActive("/admin/master-list/products") && (
                          <div className="absolute left-[42px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full ring-4 ring-sidebar" />
                        )}
                        {!isActive("/admin/master-list/products") && (
                          <div className="absolute left-[42px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-border rounded-full" />
                        )}
                        <ChefHat className="w-3.5 h-3.5 ml-2" />
                        <span>Products</span>
                      </button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Enrichment - Nested Collapsible */}
                <Collapsible open={enrichmentOpen} onOpenChange={setEnrichmentOpen}>
                  <CollapsibleTrigger
                    className={cn(
                      "w-full flex items-center justify-between gap-3 pl-8 pr-3 py-2 text-sm transition-all relative group",
                      location.pathname.includes("/enrichment")
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {location.pathname.includes("/enrichment") && (
                      <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full ring-4 ring-sidebar" />
                    )}
                    {!location.pathname.includes("/enrichment") && (
                      <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-border rounded-full" />
                    )}
                    <div className="flex items-center gap-2 ml-3">
                      <Sparkles className="w-4 h-4" />
                      <span>Enrichment</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform mr-1",
                        enrichmentOpen && "transform rotate-180"
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-0.5">
                    <div className="relative">
                      {/* Vertical line for nested submenu */}
                      <div className="absolute left-[42px] top-0 bottom-0 w-px bg-border" />
                      
                      {/* Product Enrichment */}
                      <button
                        onClick={() => navigate("/admin/enrichment/product")}
                        className={cn(
                          "w-full flex items-center gap-2 pl-14 pr-3 py-2 text-sm transition-all relative group",
                          isActive("/admin/enrichment/product")
                            ? "text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {isActive("/admin/enrichment/product") && (
                          <div className="absolute left-[42px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full ring-4 ring-sidebar" />
                        )}
                        {!isActive("/admin/enrichment/product") && (
                          <div className="absolute left-[42px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-border rounded-full" />
                        )}
                        <Package className="w-3.5 h-3.5 ml-2" />
                        <span>Product</span>
                      </button>

                      {/* Coupon Enrichment */}
                      <button
                        onClick={() => navigate("/admin/enrichment/coupon")}
                        className={cn(
                          "w-full flex items-center gap-2 pl-14 pr-3 py-2 text-sm transition-all relative group",
                          isActive("/admin/enrichment/coupon")
                            ? "text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {isActive("/admin/enrichment/coupon") && (
                          <div className="absolute left-[42px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full ring-4 ring-sidebar" />
                        )}
                        {!isActive("/admin/enrichment/coupon") && (
                          <div className="absolute left-[42px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-border rounded-full" />
                        )}
                        <Sparkles className="w-3.5 h-3.5 ml-2" />
                        <span>Coupon</span>
                      </button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;