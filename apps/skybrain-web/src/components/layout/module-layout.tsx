import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import Navbar from "@/components/navbar/index";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export default function ModuleLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar />

        <div className="flex flex-col flex-1 overflow-hidden ">
          <Navbar />
          <div className="flex-1 overflow-auto px-1 py-4">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
