import { Outlet } from "react-router-dom";
import LeftSidebar from "@/components/LeftSidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";

const Layout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <LeftSidebar />
        <SidebarInset>
          <header className="flex h-12 items-center border-b px-4 bg-background">
            <SidebarTrigger />
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;