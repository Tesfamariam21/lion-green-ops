import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  title: string;
  subtitle?: string;
  user?: { name: string; role: string };
}

const Header = ({ title, subtitle, user }: HeaderProps) => {
  return (
    <header className="h-16 bg-card/50 backdrop-blur-lg border-b border-border sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Title */}
      <div>
        <h1 className="font-display text-xl font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 pl-10 bg-secondary/50 border-border"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-accent rounded-full text-xs flex items-center justify-center text-accent-foreground">
            3
          </span>
        </Button>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground">{user?.name || "Guest"}</p>
            <p className="text-xs text-accent">{user?.role || "User"}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-lion-green to-lion-green-light flex items-center justify-center">
            <User className="h-5 w-5 text-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
