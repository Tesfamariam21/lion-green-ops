import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  user?: { name: string; role: string };
  onLogout: () => void;
}

const DashboardLayout = ({
  children,
  title,
  subtitle,
  user,
  onLogout,
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background bg-hero-pattern">
      <Sidebar onLogout={onLogout} />
      <div className="ml-20 lg:ml-64 transition-all duration-300">
        <Header title={title} subtitle={subtitle} user={user} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
