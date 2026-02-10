import {
  LayoutDashboard,
  Users,
  Car,
  DollarSign,
  MessageSquare,
  UserCircle,
  LogOut,
  Contact
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router";
import { NavLink } from "./nav-link";
import { toast } from "sonner";

const mainItems = [
  { title: "Overview", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Riders", url: "/admin/riders", icon: Users },
  { title: "Drivers", url: "/admin/drivers", icon: UserCircle },
  { title: "Trip Log", url: "/admin/trips", icon: Car },
  { title: "Driver Payouts", url: "/admin/payouts", icon: DollarSign },
  { title: "Forum Activity", url: "/admin/forum", icon: MessageSquare },
  { title: "Contacts", url: "/admin/contacts", icon: Contact },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  function logout() {
    localStorage.removeItem("commuta_token");
    toast.success("Logged out successfully");
    window.location.replace("/login");
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className={`${open ? "px-6" : "mx-auto"} py-6`}>
          <h2 className="text-xl font-bold text-sidebar-primary">
            {open ? (
              "Commuta"
            ) : (
              <Car className="w-6 h-6 text-sidebar-primary" />
            )}
          </h2>
          {open && (
            <p className="text-xs text-sidebar-foreground/70 mt-1">
              Admin Dashboard
            </p>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className="flex gap-2 cursor-pointer" onClick={logout}>
          <LogOut className="h-6 w-6" />

          {open && <span className="ml-2">Logout</span>}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
