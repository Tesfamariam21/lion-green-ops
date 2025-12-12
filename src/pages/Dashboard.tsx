import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import DispatchTable, { DispatchRecord } from "@/components/dispatch/DispatchTable";
import { Truck, CheckCircle, Clock, XCircle, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const mockRecords: DispatchRecord[] = [
  {
    id: "1",
    serialNumber: "LGS-2024-0042",
    model: "Eco Rider",
    variant: "Premium",
    productionDate: "2024-01-10",
    inspector: "John Smith",
    status: "pending",
    createdAt: "2024-01-11",
  },
  {
    id: "2",
    serialNumber: "LGS-2024-0041",
    model: "Power Haul",
    variant: "Heavy Duty",
    productionDate: "2024-01-09",
    inspector: "Sarah Lee",
    status: "approved",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    serialNumber: "LGS-2024-0040",
    model: "City Cruiser",
    variant: "Standard",
    productionDate: "2024-01-08",
    inspector: "Mike Johnson",
    status: "rejected",
    createdAt: "2024-01-09",
  },
  {
    id: "4",
    serialNumber: "LGS-2024-0039",
    model: "Cargo Max",
    variant: "Premium",
    productionDate: "2024-01-07",
    inspector: "John Smith",
    status: "approved",
    createdAt: "2024-01-08",
  },
  {
    id: "5",
    serialNumber: "LGS-2024-0038",
    model: "Eco Rider",
    variant: "Standard",
    productionDate: "2024-01-06",
    inspector: "Sarah Lee",
    status: "pending",
    createdAt: "2024-01-07",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [records, setRecords] = useState<DispatchRecord[]>(mockRecords);

  useEffect(() => {
    const storedUser = localStorage.getItem("lgs_user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("lgs_user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const handleView = (record: DispatchRecord) => {
    toast({
      title: "View Details",
      description: `Viewing details for ${record.serialNumber}`,
    });
  };

  const handleApprove = (record: DispatchRecord) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === record.id ? { ...r, status: "approved" as const } : r))
    );
    toast({
      title: "Dispatch Approved",
      description: `${record.serialNumber} has been approved for dispatch.`,
    });
  };

  const handleReject = (record: DispatchRecord) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === record.id ? { ...r, status: "rejected" as const } : r))
    );
    toast({
      title: "Dispatch Rejected",
      description: `${record.serialNumber} has been rejected.`,
      variant: "destructive",
    });
  };

  const stats = {
    total: records.length,
    pending: records.filter((r) => r.status === "pending").length,
    approved: records.filter((r) => r.status === "approved").length,
    rejected: records.filter((r) => r.status === "rejected").length,
  };

  if (!user) return null;

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Overview of dispatch operations"
      user={user}
      onLogout={handleLogout}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Dispatches"
          value={stats.total}
          change="+12% from last month"
          changeType="positive"
          icon={Truck}
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          change="2 awaiting approval"
          changeType="neutral"
          icon={Clock}
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          change="+8% this week"
          changeType="positive"
          icon={CheckCircle}
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          change="-15% from last month"
          changeType="positive"
          icon={XCircle}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button variant="brand" onClick={() => navigate("/dispatch")}>
          <Truck className="h-4 w-4 mr-2" />
          New Dispatch
        </Button>
        <Button variant="outline" onClick={() => navigate("/staff")}>
          <Users className="h-4 w-4 mr-2" />
          Manage Staff
        </Button>
        <Button variant="outline" disabled>
          <TrendingUp className="h-4 w-4 mr-2" />
          View Reports
        </Button>
      </div>

      {/* Recent Dispatches */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Recent Dispatches
        </h2>
        <Button variant="ghost" size="sm" onClick={() => navigate("/dispatch")}>
          View All
        </Button>
      </div>
      <DispatchTable
        records={records}
        onView={handleView}
        onApprove={handleApprove}
        onReject={handleReject}
        showActions={user.role === "Dispatch Manager" || user.role === "Admin"}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
