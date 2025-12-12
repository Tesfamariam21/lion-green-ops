import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Users,
  BarChart3,
  Package,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  onLogout: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Truck, label: "Dispatch", path: "/dispatch" },
  { icon: Users, label: "Staff", path: "/staff", adminOnly: true },
  { icon: Package, label: "Inventory", path: "/inventory", disabled: true },
  { icon: BarChart3, label: "Market Data", path: "/market", disabled: true },
  { icon: FileText, label: "Reports", path: "/reports", disabled: true },
];

const Sidebar = ({ onLogout }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && <Logo size="sm" showTagline />}
        {collapsed && (
          <div className="w-full flex justify-center">
            <div className="h-10 w-10 bg-gradient-to-br from-lion-green to-lion-green-light rounded-lg flex items-center justify-center">
              <span className="font-display font-bold text-foreground text-sm">LG</span>
            </div>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-sidebar border border-sidebar-border rounded-full p-1.5 hover:bg-sidebar-accent transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-sidebar-foreground" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.disabled ? "#" : item.path}
            className={({ isActive }) =>
              cn(
                "nav-link",
                isActive && !item.disabled && "active",
                item.disabled && "opacity-40 cursor-not-allowed hover:bg-transparent"
              )
            }
            onClick={(e) => item.disabled && e.preventDefault()}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && (
              <span className="flex-1">{item.label}</span>
            )}
            {!collapsed && item.disabled && (
              <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                Soon
              </span>
            )}
            {!collapsed && item.adminOnly && (
              <span className="text-xs px-2 py-0.5 rounded bg-accent/20 text-accent">
                Admin
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn("nav-link", isActive && "active")
          }
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
          {!collapsed && (
            <span className="text-xs px-2 py-0.5 rounded bg-accent/20 text-accent ml-auto">
              Admin
            </span>
          )}
        </NavLink>
        <button
          onClick={onLogout}
          className="nav-link w-full text-destructive/80 hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
