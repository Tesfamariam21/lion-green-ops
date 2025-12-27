import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DispatchRecord, DispatchChecklist } from "@/types/dispatch";
import {
  Battery,
  Wrench,
  FileText,
  Package,
  Truck,
  CheckCircle,
  Zap,
  CircleDot,
  Gauge,
  Save,
  X,
  Pencil,
} from "lucide-react";

interface DispatchDetailDialogProps {
  record: DispatchRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: DispatchRecord) => void;
  isEditing?: boolean;
}

const DispatchDetailDialog = ({
  record,
  isOpen,
  onClose,
  onSave,
  isEditing: initialEditing = false,
}: DispatchDetailDialogProps) => {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [editedRecord, setEditedRecord] = useState<DispatchRecord | null>(record);

  // Keep local state in sync with incoming record (avoid setState during render)
  useEffect(() => {
    setEditedRecord(record);
    setIsEditing(initialEditing);
  }, [record?.id, initialEditing]);

  if (!record || !editedRecord) return null;

  const handleChecklistChange = (key: keyof DispatchChecklist, value: boolean) => {
    setEditedRecord({
      ...editedRecord,
      checklist: { ...editedRecord.checklist, [key]: value },
    });
  };

  const handleFieldChange = (field: keyof DispatchRecord, value: string | number) => {
    setEditedRecord({ ...editedRecord, [field]: value });
  };

  const handleSave = () => {
    onSave(editedRecord);
    setIsEditing(false);
  };

  const ChecklistItem = ({
    id,
    label,
    checked,
  }: {
    id: keyof DispatchChecklist;
    label: string;
    checked: boolean;
  }) => (
    <div className="flex items-center gap-3 py-2">
      <Checkbox
        id={id}
        checked={checked}
        disabled={!isEditing}
        onCheckedChange={(checked) => handleChecklistChange(id, checked as boolean)}
        className="data-[state=checked]:bg-accent data-[state=checked]:border-accent data-[state=checked]:text-accent-foreground"
      />
      <Label
        htmlFor={id}
        className={`cursor-pointer ${checked ? "text-foreground" : "text-muted-foreground"}`}
      >
        {label}
      </Label>
      {checked && <CheckCircle className="h-4 w-4 text-accent ml-auto" />}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="font-display text-xl">
                Electric Tricycle Dispatch Checklist
              </DialogTitle>
              <DialogDescription>
                Serial: {record.serialNumber} | Model: {record.model}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-secondary/50">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="electrical">Electrical</TabsTrigger>
              <TabsTrigger value="mechanical">Mechanical</TabsTrigger>
              <TabsTrigger value="docs">Docs & Tools</TabsTrigger>
              <TabsTrigger value="approval">Approval</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="info" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Production Site</Label>
                  <Input
                    value={editedRecord.productionSite}
                    onChange={(e) => handleFieldChange("productionSite", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dispatch Date</Label>
                  <Input
                    type="date"
                    value={editedRecord.dispatchDate}
                    onChange={(e) => handleFieldChange("dispatchDate", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input
                    value={editedRecord.model}
                    onChange={(e) => handleFieldChange("model", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Serial/Chassis No</Label>
                  <Input
                    value={editedRecord.serialNumber}
                    onChange={(e) => handleFieldChange("serialNumber", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Destination City</Label>
                  <Input
                    value={editedRecord.destinationCity}
                    onChange={(e) => handleFieldChange("destinationCity", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input
                    value={editedRecord.customerName}
                    onChange={(e) => handleFieldChange("customerName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <h4 className="font-display font-semibold flex items-center gap-2">
                <Truck className="h-4 w-4 text-accent" />
                Transport Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Transporter Name</Label>
                  <Input
                    value={editedRecord.transporterName}
                    onChange={(e) => handleFieldChange("transporterName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Transporter Contact</Label>
                  <Input
                    value={editedRecord.transporterContact}
                    onChange={(e) => handleFieldChange("transporterContact", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Truck No.</Label>
                  <Input
                    value={editedRecord.truckNumber}
                    onChange={(e) => handleFieldChange("truckNumber", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Electrical System Tab */}
            <TabsContent value="electrical" className="space-y-4 mt-4">
              <div className="glass-card p-4">
                <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  A. Electrical System
                </h4>
                <div className="space-y-1">
                  <ChecklistItem
                    id="batteryCharged"
                    label="Battery fully charged"
                    checked={editedRecord.checklist.batteryCharged}
                  />
                  <ChecklistItem
                    id="batteryVoltageTested"
                    label="Battery voltage tested and recorded"
                    checked={editedRecord.checklist.batteryVoltageTested}
                  />
                  {editedRecord.checklist.batteryVoltageTested && (
                    <div className="ml-8 space-y-2">
                      <Label>Voltage Reading</Label>
                      <Input
                        value={editedRecord.checklist.batteryVoltageReading || ""}
                        onChange={(e) =>
                          setEditedRecord({
                            ...editedRecord,
                            checklist: {
                              ...editedRecord.checklist,
                              batteryVoltageReading: e.target.value,
                            },
                          })
                        }
                        disabled={!isEditing}
                        placeholder="e.g., 72V"
                        className="w-32"
                      />
                    </div>
                  )}
                  <ChecklistItem
                    id="chargerProvidedTested"
                    label="Charger provided and tested"
                    checked={editedRecord.checklist.chargerProvidedTested}
                  />
                  <ChecklistItem
                    id="wiringHarnessInspected"
                    label="Wiring harness inspected (no cuts, loose connections)"
                    checked={editedRecord.checklist.wiringHarnessInspected}
                  />
                  <ChecklistItem
                    id="lightsFunctioning"
                    label="Lights functioning (headlight, tail light, indicators)"
                    checked={editedRecord.checklist.lightsFunctioning}
                  />
                  <ChecklistItem
                    id="hornWorking"
                    label="Horn working"
                    checked={editedRecord.checklist.hornWorking}
                  />
                  <ChecklistItem
                    id="displayOperational"
                    label="Display / dashboard operational"
                    checked={editedRecord.checklist.displayOperational}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Mechanical Tab */}
            <TabsContent value="mechanical" className="space-y-4 mt-4">
              <div className="glass-card p-4">
                <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-accent" />
                  B. Mechanical Components
                </h4>
                <div className="space-y-1">
                  <ChecklistItem
                    id="tiresInflated"
                    label="Tires properly inflated"
                    checked={editedRecord.checklist.tiresInflated}
                  />
                  <ChecklistItem
                    id="wheelNutsTightened"
                    label="Wheel nuts tightened"
                    checked={editedRecord.checklist.wheelNutsTightened}
                  />
                  <ChecklistItem
                    id="brakesTested"
                    label="Brakes tested and adjusted"
                    checked={editedRecord.checklist.brakesTested}
                  />
                  <ChecklistItem
                    id="suspensionFunctioning"
                    label="Suspension functioning"
                    checked={editedRecord.checklist.suspensionFunctioning}
                  />
                  <ChecklistItem
                    id="steeringAlignmentChecked"
                    label="Steering alignment checked"
                    checked={editedRecord.checklist.steeringAlignmentChecked}
                  />
                  <ChecklistItem
                    id="frameInspected"
                    label="Frame inspected for weld quality / damages"
                    checked={editedRecord.checklist.frameInspected}
                  />
                  <ChecklistItem
                    id="fastenersAndBoltsTightened"
                    label="Fasteners and bolts tightened"
                    checked={editedRecord.checklist.fastenersAndBoltsTightened}
                  />
                </div>
              </div>

              <div className="glass-card p-4">
                <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-accent" />
                  C. Motor & VCU
                </h4>
                <div className="space-y-1">
                  <ChecklistItem
                    id="motorPerformanceTested"
                    label="Motor performance tested"
                    checked={editedRecord.checklist.motorPerformanceTested}
                  />
                  <ChecklistItem
                    id="controllerFunctioning"
                    label="Controller functioning"
                    checked={editedRecord.checklist.controllerFunctioning}
                  />
                  <ChecklistItem
                    id="speedTestPassed"
                    label="Speed Test passed"
                    checked={editedRecord.checklist.speedTestPassed}
                  />
                  <ChecklistItem
                    id="noAbnormalNoises"
                    label="No abnormal noises during drive test"
                    checked={editedRecord.checklist.noAbnormalNoises}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Docs & Tools Tab */}
            <TabsContent value="docs" className="space-y-4 mt-4">
              <div className="glass-card p-4">
                <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent" />
                  2. Documentation Pack
                </h4>
                <div className="space-y-1">
                  <ChecklistItem
                    id="invoiceIncluded"
                    label="Invoice"
                    checked={editedRecord.checklist.invoiceIncluded}
                  />
                  <ChecklistItem
                    id="warrantyCardIncluded"
                    label="Warranty card"
                    checked={editedRecord.checklist.warrantyCardIncluded}
                  />
                  <ChecklistItem
                    id="userManualIncluded"
                    label="User manual"
                    checked={editedRecord.checklist.userManualIncluded}
                  />
                </div>
              </div>

              <div className="glass-card p-4">
                <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-4 w-4 text-accent" />
                  3. Accessories & Tools
                </h4>
                <div className="space-y-1">
                  <ChecklistItem
                    id="escortTire"
                    label="Escort tire"
                    checked={editedRecord.checklist.escortTire}
                  />
                  <ChecklistItem
                    id="toolkit"
                    label="Toolkit (wrench, tire wrench..)"
                    checked={editedRecord.checklist.toolkit}
                  />
                  <ChecklistItem
                    id="chargerAndCables"
                    label="Charger + cables"
                    checked={editedRecord.checklist.chargerAndCables}
                  />
                  <div className="flex items-center gap-3 py-2">
                    <Label>Battery keys, ignition keys (number of keys):</Label>
                    <Input
                      type="number"
                      min={0}
                      value={editedRecord.checklist.numberOfKeys || 0}
                      onChange={(e) =>
                        setEditedRecord({
                          ...editedRecord,
                          checklist: {
                            ...editedRecord.checklist,
                            numberOfKeys: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      disabled={!isEditing}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card p-4">
                <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-accent" />
                  4. Transport Verification
                </h4>
                <div className="space-y-1">
                  <ChecklistItem
                    id="tricycleSecured"
                    label="Tricycle secured inside the truck"
                    checked={editedRecord.checklist.tricycleSecured}
                  />
                  <ChecklistItem
                    id="photographsTaken"
                    label="Photographs taken before loading"
                    checked={editedRecord.checklist.photographsTaken}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Approval Tab */}
            <TabsContent value="approval" className="space-y-4 mt-4">
              <div className="glass-card p-4">
                <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  5. Final Approval
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>QC Inspector Name</Label>
                    <Input
                      value={editedRecord.qcInspectorName}
                      onChange={(e) => handleFieldChange("qcInspectorName", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>QC Inspector Signature</Label>
                    <Input
                      value={editedRecord.qcInspectorSignature || ""}
                      onChange={(e) => handleFieldChange("qcInspectorSignature", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Digital signature"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dispatch Manager Name</Label>
                    <Input
                      value={editedRecord.dispatchManagerName || ""}
                      onChange={(e) => handleFieldChange("dispatchManagerName", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dispatch Manager Signature</Label>
                    <Input
                      value={editedRecord.dispatchManagerSignature || ""}
                      onChange={(e) =>
                        handleFieldChange("dispatchManagerSignature", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Digital signature"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Date & Time of Dispatch</Label>
                    <Input
                      type="datetime-local"
                      value={editedRecord.dispatchDateTime || ""}
                      onChange={(e) => handleFieldChange("dispatchDateTime", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card p-4">
                <h4 className="font-display font-semibold mb-4">Additional Notes</h4>
                <Textarea
                  value={editedRecord.notes || ""}
                  onChange={(e) => handleFieldChange("notes", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Additional notes or observations..."
                  className="min-h-[80px]"
                />
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {isEditing && (
            <Button variant="brand" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DispatchDetailDialog;
