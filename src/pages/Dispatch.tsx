import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DispatchForm from "@/components/dispatch/DispatchForm";
import DispatchTable from "@/components/dispatch/DispatchTable";
import DispatchDetailDialog from "@/components/dispatch/DispatchDetailDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, List } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDispatchRecords } from "@/hooks/useDispatchRecords";

const Dispatch = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const { records, loading: recordsLoading, approveRecord, rejectRecord, updateRecord } = useDispatchRecords();
  const [activeTab, setActiveTab] = useState("list");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const handleView = (record: any) => {
    const originalRecord = records.find(r => r.id === record.id);
    if (!originalRecord) return;
    
    const convertedRecord = {
      id: originalRecord.id,
      serialNumber: originalRecord.serial_no,
      model: originalRecord.model,
      variant: "Standard",
      productionDate: originalRecord.dispatch_date,
      productionSite: "Main Factory",
      dispatchDate: originalRecord.dispatch_date,
      destinationCity: originalRecord.destination_city,
      customerName: originalRecord.customer_name,
      transporterName: originalRecord.transporter_name,
      transporterContact: originalRecord.transporter_contact,
      truckNumber: originalRecord.truck_no,
      status: originalRecord.status,
      qcInspectorName: originalRecord.qc_inspector_name || "",
      dispatchManagerName: originalRecord.dispatch_manager_name || "",
      notes: "",
      createdAt: originalRecord.created_at,
      checklist: {
        batteryCharged: originalRecord.battery_charged || false,
        batteryVoltageTested: originalRecord.battery_voltage_tested || false,
        chargerProvidedTested: originalRecord.charger_provided || false,
        wiringHarnessInspected: originalRecord.wiring_inspected || false,
        lightsFunctioning: originalRecord.lights_functioning || false,
        hornWorking: originalRecord.horn_working || false,
        displayOperational: originalRecord.dashboard_operational || false,
        tiresInflated: originalRecord.tires_inflated || false,
        wheelNutsTightened: originalRecord.wheel_nuts_tightened || false,
        brakesTested: originalRecord.brakes_tested || false,
        suspensionFunctioning: originalRecord.suspension_functioning || false,
        steeringAlignmentChecked: originalRecord.steering_checked || false,
        frameInspected: originalRecord.frame_inspected || false,
        fastenersAndBoltsTightened: originalRecord.fasteners_tightened || false,
        motorPerformanceTested: originalRecord.motor_tested || false,
        controllerFunctioning: originalRecord.controller_functioning || false,
        speedTestPassed: originalRecord.speed_tested || false,
        noAbnormalNoises: originalRecord.no_abnormal_noises || false,
        invoiceIncluded: originalRecord.invoice_included || false,
        warrantyCardIncluded: originalRecord.warranty_card_included || false,
        userManualIncluded: originalRecord.user_manual_included || false,
        escortTire: originalRecord.escort_tire_included || false,
        toolkit: originalRecord.toolkit_included || false,
        chargerAndCables: originalRecord.charger_cables_included || false,
        numberOfKeys: originalRecord.keys_count || 0,
        tricycleSecured: originalRecord.tricycle_secured || false,
        photographsTaken: originalRecord.photos_taken || false,
      },
    };
    setSelectedRecord(convertedRecord);
    setIsDetailOpen(true);
  };

  const handleSaveRecord = async (updatedRecord: any) => {
    await updateRecord(updatedRecord.id, {
      model: updatedRecord.model,
      destination_city: updatedRecord.destinationCity,
      customer_name: updatedRecord.customerName,
      transporter_name: updatedRecord.transporterName,
      transporter_contact: updatedRecord.transporterContact,
      truck_no: updatedRecord.truckNumber,
    });
  };

  const handleApprove = async (record: any) => {
    await approveRecord(record.id, profile?.name || "Manager");
  };

  const handleReject = async (record: any) => {
    await rejectRecord(record.id, "Rejected by manager");
  };

  // Convert records to the format expected by DispatchTable
  const tableRecords = records.map((r) => ({
    id: r.id,
    serialNumber: r.serial_no,
    model: r.model,
    variant: "Standard",
    productionDate: r.dispatch_date,
    productionSite: "Main Factory",
    dispatchDate: r.dispatch_date,
    destinationCity: r.destination_city,
    customerName: r.customer_name,
    transporterName: r.transporter_name,
    transporterContact: r.transporter_contact,
    truckNumber: r.truck_no,
    status: r.status as "pending" | "approved" | "rejected",
    qcInspectorName: r.qc_inspector_name || "",
    createdAt: r.created_at,
    checklist: {
      batteryCharged: r.battery_charged || false,
      batteryVoltageTested: r.battery_voltage_tested || false,
      chargerProvidedTested: r.charger_provided || false,
      wiringHarnessInspected: r.wiring_inspected || false,
      lightsFunctioning: r.lights_functioning || false,
      hornWorking: r.horn_working || false,
      displayOperational: r.dashboard_operational || false,
      tiresInflated: r.tires_inflated || false,
      wheelNutsTightened: r.wheel_nuts_tightened || false,
      brakesTested: r.brakes_tested || false,
      suspensionFunctioning: r.suspension_functioning || false,
      steeringAlignmentChecked: r.steering_checked || false,
      frameInspected: r.frame_inspected || false,
      fastenersAndBoltsTightened: r.fasteners_tightened || false,
      motorPerformanceTested: r.motor_tested || false,
      controllerFunctioning: r.controller_functioning || false,
      speedTestPassed: r.speed_tested || false,
      noAbnormalNoises: r.no_abnormal_noises || false,
      invoiceIncluded: r.invoice_included || false,
      warrantyCardIncluded: r.warranty_card_included || false,
      userManualIncluded: r.user_manual_included || false,
      escortTire: r.escort_tire_included || false,
      toolkit: r.toolkit_included || false,
      chargerAndCables: r.charger_cables_included || false,
      numberOfKeys: r.keys_count || 0,
      tricycleSecured: r.tricycle_secured || false,
      photographsTaken: r.photos_taken || false,
    },
  }));

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  const userInfo = {
    name: profile?.name || user.email?.split("@")[0] || "User",
    role: profile?.role || "quality_inspector",
  };

  return (
    <DashboardLayout
      title="Dispatch Management"
      subtitle="Register and manage tricycle dispatches"
      user={userInfo}
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
          {recordsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : (
            <DispatchTable
              records={tableRecords}
              onView={handleView}
              onApprove={handleApprove}
              onReject={handleReject}
              showActions
            />
          )}
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
