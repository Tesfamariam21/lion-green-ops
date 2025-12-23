import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { mockVehicles } from "@/data/mockFleetData";
import { Vehicle, VehicleStatus, STATUS_COLORS, CONDITION_COLORS } from "@/types/fleet";
import {
  Plus,
  Search,
  Car,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Eye,
  Pencil,
  Settings2,
} from "lucide-react";

const Fleet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "all">("all");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState<Vehicle | null>(null);

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

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setEditedVehicle({ ...vehicle });
    setIsDetailOpen(true);
    setIsEditing(false);
  };

  const handleSaveVehicle = () => {
    if (!editedVehicle) return;
    setVehicles(vehicles.map((v) => (v.id === editedVehicle.id ? editedVehicle : v)));
    setSelectedVehicle(editedVehicle);
    setIsEditing(false);
    toast({ title: "Vehicle Updated", description: "Vehicle information saved successfully." });
  };

  const handleFlagMaintenance = (vehicleId: string) => {
    setVehicles(
      vehicles.map((v) =>
        v.id === vehicleId
          ? { ...v, flaggedForMaintenance: true, status: "maintenance" as VehicleStatus }
          : v
      )
    );
    toast({ title: "Flagged for Maintenance", description: "Vehicle has been flagged for service." });
  };

  const getStatusBadge = (status: VehicleStatus) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const stats = {
    available: vehicles.filter((v) => v.status === "available").length,
    dispatched: vehicles.filter((v) => v.status === "dispatched").length,
    rented: vehicles.filter((v) => v.status === "rented").length,
    maintenance: vehicles.filter((v) => v.status === "maintenance").length,
  };

  if (!user) return null;

  return (
    <DashboardLayout
      title="Fleet Management"
      subtitle="Manage vehicles, maintenance, and rentals"
      user={user}
      onLogout={handleLogout}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{stats.available}</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Car className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{stats.dispatched}</p>
              <p className="text-sm text-muted-foreground">Dispatched</p>
            </div>
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{stats.rented}</p>
              <p className="text-sm text-muted-foreground">Rented</p>
            </div>
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{stats.maintenance}</p>
              <p className="text-sm text-muted-foreground">Maintenance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by serial, model, or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as VehicleStatus | "all")}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="dispatched">Dispatched</SelectItem>
            <SelectItem value="rented">Rented</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vehicles Table */}
      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Serial Number</TableHead>
              <TableHead className="text-muted-foreground">Model</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Condition</TableHead>
              <TableHead className="text-muted-foreground">Customer/Renter</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.map((vehicle) => (
              <TableRow
                key={vehicle.id}
                className="border-border hover:bg-secondary/30 transition-colors cursor-pointer"
                onClick={() => handleViewVehicle(vehicle)}
              >
                <TableCell className="font-medium text-foreground">{vehicle.serialNumber}</TableCell>
                <TableCell className="text-muted-foreground">
                  {vehicle.model} - {vehicle.variant}
                </TableCell>
                <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                <TableCell>
                  <span className={CONDITION_COLORS[vehicle.condition]}>
                    {vehicle.condition.replace("_", " ").charAt(0).toUpperCase() +
                      vehicle.condition.slice(1).replace("_", " ")}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {vehicle.rental.isRented
                    ? vehicle.rental.renterName
                    : vehicle.customerName || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" onClick={() => handleViewVehicle(vehicle)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {vehicle.status !== "maintenance" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-yellow-400 hover:text-yellow-300"
                        onClick={() => handleFlagMaintenance(vehicle.id)}
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Vehicle Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Car className="h-5 w-5 text-accent" />
              Vehicle Details
            </DialogTitle>
            <DialogDescription>
              {selectedVehicle?.serialNumber} - {selectedVehicle?.model}
            </DialogDescription>
          </DialogHeader>

          {editedVehicle && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="rental">Rental</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Serial Number</Label>
                    <Input value={editedVehicle.serialNumber} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input
                      value={editedVehicle.model}
                      disabled={!isEditing}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, model: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Variant</Label>
                    <Input
                      value={editedVehicle.variant}
                      disabled={!isEditing}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, variant: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={editedVehicle.status}
                      disabled={!isEditing}
                      onValueChange={(v) => setEditedVehicle({ ...editedVehicle, status: v as VehicleStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="dispatched">Dispatched</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Select
                      value={editedVehicle.condition}
                      disabled={!isEditing}
                      onValueChange={(v) =>
                        setEditedVehicle({ ...editedVehicle, condition: v as Vehicle["condition"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="needs_repair">Needs Repair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Production Site</Label>
                    <Input value={editedVehicle.productionSite} disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={editedVehicle.notes || ""}
                    disabled={!isEditing}
                    onChange={(e) => setEditedVehicle({ ...editedVehicle, notes: e.target.value })}
                    placeholder="Add notes..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="rental" className="space-y-4 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-muted-foreground">Rental Status:</span>
                  {editedVehicle.rental.isRented ? (
                    <span className="status-badge status-approved">Active Rental</span>
                  ) : (
                    <span className="status-badge bg-muted text-muted-foreground border-muted">
                      Not Rented
                    </span>
                  )}
                </div>
                {editedVehicle.rental.isRented && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Renter Name</Label>
                      <Input
                        value={editedVehicle.rental.renterName || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setEditedVehicle({
                            ...editedVehicle,
                            rental: { ...editedVehicle.rental, renterName: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact</Label>
                      <Input
                        value={editedVehicle.rental.renterContact || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setEditedVehicle({
                            ...editedVehicle,
                            rental: { ...editedVehicle.rental, renterContact: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input value={editedVehicle.rental.rentalStartDate || ""} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={editedVehicle.rental.rentalEndDate || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setEditedVehicle({
                            ...editedVehicle,
                            rental: { ...editedVehicle.rental, rentalEndDate: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Rental Terms</Label>
                      <Textarea
                        value={editedVehicle.rental.rentalTerms || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setEditedVehicle({
                            ...editedVehicle,
                            rental: { ...editedVehicle.rental, rentalTerms: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="maintenance" className="space-y-4 pt-4">
                {editedVehicle.flaggedForMaintenance && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <span className="text-yellow-400 text-sm">Flagged for maintenance</span>
                  </div>
                )}
                <div className="space-y-3">
                  <Label>Maintenance History</Label>
                  {editedVehicle.maintenanceRecords.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No maintenance records yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {editedVehicle.maintenanceRecords.map((record) => (
                        <div key={record.id} className="p-3 rounded-lg bg-secondary/30 border border-border">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-foreground">{record.description}</p>
                              <p className="text-sm text-muted-foreground">
                                By {record.mechanicName} • {record.date}
                              </p>
                            </div>
                            {record.cost && (
                              <span className="text-accent font-medium">ETB {record.cost.toLocaleString()}</span>
                            )}
                          </div>
                          {record.notes && (
                            <p className="text-sm text-muted-foreground mt-2">{record.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="mt-4">
            {!isEditing ? (
              <Button variant="brand" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button variant="brand" onClick={handleSaveVehicle}>
                  Save Changes
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Fleet;
