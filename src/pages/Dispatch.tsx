import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DispatchForm from "@/components/dispatch/DispatchForm";
import DispatchTable from "@/components/dispatch/DispatchTable";
import DispatchDetailDialog from "@/components/dispatch/DispatchDetailDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, List } from "lucide-react";
import { DispatchRecord } from "@/types/dispatch";
import { mockDispatchRecords } from "@/data/mockDispatchRecords";

const Dispatch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [records, setRecords] = useState<DispatchRecord[]>(mockDispatchRecords);
  const [activeTab, setActiveTab] = useState("list");
  const [selectedRecord, setSelectedRecord] = useState<DispatchRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
    navigate("/login");
  };

  const handleView = (record: DispatchRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handleSaveRecord = (updatedRecord: DispatchRecord) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r))
    );
    toast({
      title: "Record Updated",
      description: `Dispatch ${updatedRecord.serialNumber} has been updated.`,
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

  if (!user) return null;

  return (
    <DashboardLayout
      title="Dispatch Management"
      subtitle="Register and manage tricycle dispatches"
      user={user}
      onLogout={handleLogout}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-secondary/50 border border-border">
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <List className="h-4 w-4 mr-2" />
            All Dispatches
          </TabsTrigger>
          <TabsTrigger
            value="new"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Dispatch
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Dispatch Records
              </h3>
              <p className="text-sm text-muted-foreground">
                {records.length} total records - Click a row to view details
              </p>
            </div>
            <Button variant="brand" onClick={() => setActiveTab("new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Dispatch
            </Button>
          </div>
          <DispatchTable
            records={records}
            onView={handleView}
            onApprove={handleApprove}
            onReject={handleReject}
            showActions
          />
        </TabsContent>

        <TabsContent value="new" className="animate-fade-in">
          <div className="mb-6">
            <h3 className="font-display text-lg font-semibold text-foreground">
              New Dispatch Checklist
            </h3>
            <p className="text-sm text-muted-foreground">
              Complete the quality inspection checklist for a new tricycle
            </p>
          </div>
          <DispatchForm />
        </TabsContent>
      </Tabs>

      <DispatchDetailDialog
        record={selectedRecord}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onSave={handleSaveRecord}
      />
    </DashboardLayout>
  );
};

export default Dispatch;
