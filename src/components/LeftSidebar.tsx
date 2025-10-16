import { NavLink, useLocation } from "react-router-dom";
import { Menu, Store, Clock, List, Package, Settings, Upload, Rocket, Timer } from "lucide-react";
import { useDeployment } from "@/contexts/DeploymentContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const LeftSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const { changes, newProductsCount } = useDeployment();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-4 py-3">
        {!collapsed ? (
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight">S.A.U.C.E</h1>
            <p className="text-xs text-muted-foreground">Smart Administration for Unified Commerce Enablement</p>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="text-lg font-bold">S</span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && <span className="text-xs font-semibold text-muted-foreground">Restaurant Ops</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/"} tooltip="Menu Management">
                  <NavLink to="/">
                    <Menu className="w-4 h-4" />
                    {!collapsed && <span>Menu Management</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/store-management"} tooltip="Store Management">
                  <NavLink to="/store-management">
                    <Store className="w-4 h-4" />
                    {!collapsed && <span>Store Management</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/time-based-menus"} tooltip="Time Based Menus">
                  <NavLink to="/time-based-menus">
                    <Clock className="w-4 h-4" />
                    {!collapsed && <span>Time Based Menus</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && <span className="text-xs font-semibold text-muted-foreground">Central Ops</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/admin/master-list/stores"} tooltip="Stores Master List">
                  <NavLink to="/admin/master-list/stores">
                    <List className="w-4 h-4" />
                    {!collapsed && <span>Stores Master List</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/admin/master-list/products"} tooltip="Products Master List">
                  <NavLink to="/admin/master-list/products" className="relative">
                    <Package className="w-4 h-4" />
                    {!collapsed && (
                      <span className="flex items-center gap-2">
                        Products Master List
                        {newProductsCount > 0 && (
                          <span className="flex items-center justify-center w-5 h-5 text-xs rounded-full bg-primary text-primary-foreground">
                            {newProductsCount}
                          </span>
                        )}
                      </span>
                    )}
                    {collapsed && newProductsCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs rounded-full bg-primary text-primary-foreground">
                        {newProductsCount}
                      </span>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/admin/enrichment/product"} tooltip="Product Enrichment">
                  <NavLink to="/admin/enrichment/product">
                    <Settings className="w-4 h-4" />
                    {!collapsed && <span>Product Enrichment</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/admin/enrichment/coupon"} tooltip="Coupon Enrichment">
                  <NavLink to="/admin/enrichment/coupon">
                    <Settings className="w-4 h-4" />
                    {!collapsed && <span>Coupon Enrichment</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === "/admin/bulk-upload" || location.pathname === "/admin/bulk-menu-upload" || location.pathname === "/admin/bulk-location-upload"} 
                  tooltip="Bulk Upload"
                >
                  <NavLink to="/admin/bulk-upload">
                    <Upload className="w-4 h-4" />
                    {!collapsed && <span>Bulk Upload</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/admin/prep-time"} tooltip="Prep Time">
                  <NavLink to="/admin/prep-time">
                    <Timer className="w-4 h-4" />
                    {!collapsed && <span>Prep Time</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/admin/deploy"} tooltip="Deploy Changes">
                  <NavLink to="/admin/deploy" className="relative">
                    <Rocket className="w-4 h-4" />
                    {!collapsed && (
                      <span className="flex items-center gap-2">
                        Deploy
                        {changes.length > 0 && (
                          <span className="flex items-center justify-center w-5 h-5 text-xs rounded-full bg-primary text-primary-foreground">
                            {changes.length}
                          </span>
                        )}
                      </span>
                    )}
                    {collapsed && changes.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs rounded-full bg-primary text-primary-foreground">
                        {changes.length}
                      </span>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default LeftSidebar;
