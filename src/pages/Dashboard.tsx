import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import DispatchTable from "@/components/dispatch/DispatchTable";
import DispatchDetailDialog from "@/components/dispatch/DispatchDetailDialog";
import { Truck, CheckCircle, Clock, XCircle, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useDispatchRecords } from "@/hooks/useDispatchRecords";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const { records, loading: recordsLoading, approveRecord, rejectRecord, updateRecord } = useDispatchRecords();
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
    // Convert DB record to the format expected by the dialog
    const convertedRecord = {
      id: record.id,
      serialNumber: record.serial_no,
      model: record.model,
      variant: "Standard",
      productionDate: record.dispatch_date,
      productionSite: "Main Factory",
      dispatchDate: record.dispatch_date,
      destinationCity: record.destination_city,
      customerName: record.customer_name,
      transporterName: record.transporter_name,
      transporterContact: record.transporter_contact,
      truckNumber: record.truck_no,
      status: record.status,
      qcInspectorName: record.qc_inspector_name || "",
      dispatchManagerName: record.dispatch_manager_name || "",
      notes: "",
      createdAt: record.created_at,
      checklist: {
        batteryCharged: record.battery_charged,
        batteryVoltageTested: record.battery_voltage_tested,
        chargerProvidedTested: record.charger_provided,
        wiringHarnessInspected: record.wiring_inspected,
        lightsFunctioning: record.lights_functioning,
        hornWorking: record.horn_working,
        displayOperational: record.dashboard_operational,
        tiresInflated: record.tires_inflated,
        wheelNutsTightened: record.wheel_nuts_tightened,
        brakesTested: record.brakes_tested,
        suspensionFunctioning: record.suspension_functioning,
        steeringAlignmentChecked: record.steering_checked,
        frameInspected: record.frame_inspected,
        fastenersAndBoltsTightened: record.fasteners_tightened,
        motorPerformanceTested: record.motor_tested,
        controllerFunctioning: record.controller_functioning,
        speedTestPassed: record.speed_tested,
        noAbnormalNoises: record.no_abnormal_noises,
        invoiceIncluded: record.invoice_included,
        warrantyCardIncluded: record.warranty_card_included,
        userManualIncluded: record.user_manual_included,
        escortTire: record.escort_tire_included,
        toolkit: record.toolkit_included,
        chargerAndCables: record.charger_cables_included,
        numberOfKeys: record.keys_count || 0,
        tricycleSecured: record.tricycle_secured,
        photographsTaken: record.photos_taken,
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

  const stats = {
    total: records.length,
    pending: records.filter((r) => r.status === "pending").length,
    approved: records.filter((r) => r.status === "approved").length,
    rejected: records.filter((r) => r.status === "rejected").length,
  };

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
      title="Dashboard"
      subtitle="Overview of dispatch operations"
      user={userInfo}
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
          change={`${stats.pending} awaiting approval`}
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
          showActions={profile?.role === "general_manager" || profile?.role === "fleet_supervisor"}
        />
      )}

      <DispatchDetailDialog
        record={selectedRecord}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onSave={handleSaveRecord}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
