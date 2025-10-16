import { NavLink } from "react-router-dom";
import { Menu, Store, Clock, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const TopNavigation = () => {
  return (
    <nav className="border-b bg-card">
      <div className="flex items-center gap-2 px-4 h-14">
        <span className="font-semibold text-lg mr-4">RestaurantOps</span>
        
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`
          }
        >
          <Menu className="w-4 h-4 inline-block mr-2" />
          Menu Management
        </NavLink>
        
        <NavLink
          to="/store-management"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`
          }
        >
          <Store className="w-4 h-4 inline-block mr-2" />
          Store Management
        </NavLink>
        
        <NavLink
          to="/time-based-menus"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`
          }
        >
          <Clock className="w-4 h-4 inline-block mr-2" />
          Time Based Menus
        </NavLink>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-auto">
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <NavLink to="/admin/master-list/stores" className="cursor-pointer">
                Stores Master List
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink to="/admin/master-list/products" className="cursor-pointer">
                Products Master List
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <NavLink to="/admin/product-enrichment" className="cursor-pointer">
                Product Enrichment
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink to="/admin/coupon-enrichment" className="cursor-pointer">
                Coupon Enrichment
              </NavLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default TopNavigation;
