import { LayoutDashboard, Users, Car, DollarSign, MessageSquare, UserCircle } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {  useLocation } from "react-router";
import { NavLink } from "./nav-link";

const mainItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Riders", url: "/riders", icon: Users },
  { title: "Drivers", url: "/drivers", icon: UserCircle },
  { title: "Trip Log", url: "/trips", icon: Car },
  { title: "Driver Payouts", url: "/payouts", icon: DollarSign },
  { title: "Forum Activity", url: "/forum", icon: MessageSquare },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-6 py-6">
          <h2 className="text-xl font-bold text-sidebar-primary">Commuta</h2>
          {open && <p className="text-xs text-sidebar-foreground/70 mt-1">Admin Dashboard</p>}
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
    </Sidebar>
  );
}
