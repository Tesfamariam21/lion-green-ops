import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useDispatchRecords } from "@/hooks/useDispatchRecords";
import { useAuth } from "@/contexts/AuthContext";
import {
  Truck,
  Battery,
  CircleDot,
  Gauge,
  Lightbulb,
  Wrench,
  FileText,
  Package,
  Zap,
  CheckCircle,
  LucideIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Models available
const MODELS = ["A0", "A0L", "A1", "A1L"];

interface ChecklistSection {
  title: string;
  icon: LucideIcon;
  items: { id: string; label: string }[];
}

const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    title: "A. Electrical System",
    icon: Zap,
    items: [
      { id: "battery_charged", label: "Battery fully charged" },
      { id: "battery_voltage_tested", label: "Battery voltage tested and recorded" },
      { id: "charger_provided", label: "Charger provided and tested" },
      { id: "wiring_inspected", label: "Wiring harness inspected (no cuts, loose connections)" },
      { id: "lights_functioning", label: "Lights functioning (headlight, tail light, indicators)" },
      { id: "horn_working", label: "Horn working" },
      { id: "dashboard_operational", label: "Display / dashboard operational" },
    ],
  },
  {
    title: "B. Mechanical Components",
    icon: CircleDot,
    items: [
      { id: "tires_inflated", label: "Tires properly inflated" },
      { id: "wheel_nuts_tightened", label: "Wheel nuts tightened" },
      { id: "brakes_tested", label: "Brakes tested and adjusted" },
      { id: "suspension_functioning", label: "Suspension functioning" },
      { id: "steering_checked", label: "Steering alignment checked" },
      { id: "frame_inspected", label: "Frame inspected for weld quality / damages" },
      { id: "fasteners_tightened", label: "Fasteners and bolts tightened" },
    ],
  },
  {
    title: "C. Motor & VCU",
    icon: Gauge,
    items: [
      { id: "motor_tested", label: "Motor performance tested" },
      { id: "controller_functioning", label: "Controller functioning" },
      { id: "speed_tested", label: "Speed test passed" },
      { id: "no_abnormal_noises", label: "No abnormal noises during drive test" },
    ],
  },
  {
    title: "2. Documentation Pack",
    icon: FileText,
    items: [
      { id: "invoice_included", label: "Invoice" },
      { id: "warranty_card_included", label: "Warranty card" },
      { id: "user_manual_included", label: "User manual" },
    ],
  },
  {
    title: "3. Accessories & Tools",
    icon: Package,
    items: [
      { id: "escort_tire_included", label: "Escort tire" },
      { id: "toolkit_included", label: "Toolkit (wrench, tire wrench..)" },
      { id: "charger_cables_included", label: "Charger + cables" },
    ],
  },
  {
    title: "4. Transport Verification",
    icon: Truck,
    items: [
      { id: "tricycle_secured", label: "Tricycle secured inside the truck" },
      { id: "photos_taken", label: "Photographs taken before loading" },
    ],
  },
];

// Flatten all checklist item ids for initial state
const ALL_CHECKLIST_IDS = CHECKLIST_SECTIONS.flatMap((s) => s.items.map((i) => i.id));

interface DispatchFormProps {
  onSuccess?: () => void;
}

const DispatchForm = ({ onSuccess }: DispatchFormProps) => {
  const { toast } = useToast();
  const { addRecord } = useDispatchRecords();
  const { profile } = useAuth();

  // Basic info
  const [serialNumber, setSerialNumber] = useState("");
  const [model, setModel] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [dispatchDate, setDispatchDate] = useState(new Date().toISOString().split("T")[0]);
  const [destinationCity, setDestinationCity] = useState("");
  const [customerName, setCustomerName] = useState("");

  // Transport info
  const [transporterName, setTransporterName] = useState("");
  const [transporterContact, setTransporterContact] = useState("");
  const [truckNo, setTruckNo] = useState("");

  // Keys count
  const [keysCount, setKeysCount] = useState(2);

  // Checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    Object.fromEntries(ALL_CHECKLIST_IDS.map((id) => [id, false]))
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChecklistChange = (id: string, checked: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [id]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const finalModel = model === "other" ? customModel.trim() : model;
    if (!finalModel) {
      toast({ title: "Model Required", description: "Please select or enter a model.", variant: "destructive" });
      return;
    }
    if (!serialNumber.trim()) {
      toast({ title: "Serial Required", description: "Please enter the serial number.", variant: "destructive" });
      return;
    }
    if (!customerName.trim() || !destinationCity.trim()) {
      toast({ title: "Missing Info", description: "Customer name and destination are required.", variant: "destructive" });
      return;
    }
    if (!transporterName.trim() || !transporterContact.trim() || !truckNo.trim()) {
      toast({ title: "Missing Transport Info", description: "All transport fields are required.", variant: "destructive" });
      return;
    }

    // Check all checklist items
    const allChecked = ALL_CHECKLIST_IDS.every((id) => checkedItems[id]);
    if (!allChecked) {
      toast({
        title: "Incomplete Checklist",
        description: "Please complete all checklist items before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const result = await addRecord({
      serial_no: serialNumber.trim(),
      model: finalModel,
      dispatch_date: dispatchDate,
      destination_city: destinationCity.trim(),
      customer_name: customerName.trim(),
      transporter_name: transporterName.trim(),
      transporter_contact: transporterContact.trim(),
      truck_no: truckNo.trim(),
      qc_inspector_name: profile?.name || null,
      keys_count: keysCount,

      // Checklist fields
      battery_charged: checkedItems.battery_charged,
      battery_voltage_tested: checkedItems.battery_voltage_tested,
      charger_provided: checkedItems.charger_provided,
      wiring_inspected: checkedItems.wiring_inspected,
      lights_functioning: checkedItems.lights_functioning,
      horn_working: checkedItems.horn_working,
      dashboard_operational: checkedItems.dashboard_operational,

      tires_inflated: checkedItems.tires_inflated,
      wheel_nuts_tightened: checkedItems.wheel_nuts_tightened,
      brakes_tested: checkedItems.brakes_tested,
      suspension_functioning: checkedItems.suspension_functioning,
      steering_checked: checkedItems.steering_checked,
      frame_inspected: checkedItems.frame_inspected,
      fasteners_tightened: checkedItems.fasteners_tightened,

      motor_tested: checkedItems.motor_tested,
      controller_functioning: checkedItems.controller_functioning,
      speed_tested: checkedItems.speed_tested,
      no_abnormal_noises: checkedItems.no_abnormal_noises,

      invoice_included: checkedItems.invoice_included,
      warranty_card_included: checkedItems.warranty_card_included,
      user_manual_included: checkedItems.user_manual_included,

      escort_tire_included: checkedItems.escort_tire_included,
      toolkit_included: checkedItems.toolkit_included,
      charger_cables_included: checkedItems.charger_cables_included,

      tricycle_secured: checkedItems.tricycle_secured,
      photos_taken: checkedItems.photos_taken,
    });

    setIsSubmitting(false);

    if (result) {
      // Reset form
      setSerialNumber("");
      setModel("");
      setCustomModel("");
      setDispatchDate(new Date().toISOString().split("T")[0]);
      setDestinationCity("");
      setCustomerName("");
      setTransporterName("");
      setTransporterContact("");
      setTruckNo("");
      setKeysCount(2);
      setCheckedItems(Object.fromEntries(ALL_CHECKLIST_IDS.map((id) => [id, false])));
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Tricycle Details */}
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Truck className="h-5 w-5 text-accent" />
          Tricycle Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial / Chassis Number *</Label>
            <Input
              id="serialNumber"
              placeholder="e.g., LGS-2024-0001"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model *</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other (specify)</SelectItem>
              </SelectContent>
            </Select>
            {model === "other" && (
              <Input
                placeholder="Enter custom model"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                className="mt-2"
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dispatchDate">Dispatch Date *</Label>
            <Input
              id="dispatchDate"
              type="date"
              value={dispatchDate}
              onChange={(e) => setDispatchDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destinationCity">Destination City *</Label>
            <Input
              id="destinationCity"
              placeholder="e.g., Addis Ababa"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              placeholder="Full name of customer"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Transport Information */}
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Truck className="h-5 w-5 text-accent" />
          Transport Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="transporterName">Transporter Name *</Label>
            <Input
              id="transporterName"
              placeholder="Driver / company name"
              value={transporterName}
              onChange={(e) => setTransporterName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transporterContact">Transporter Contact *</Label>
            <Input
              id="transporterContact"
              placeholder="Phone number"
              value={transporterContact}
              onChange={(e) => setTransporterContact(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="truckNo">Truck No. *</Label>
            <Input
              id="truckNo"
              placeholder="Plate number"
              value={truckNo}
              onChange={(e) => setTruckNo(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Quality Inspection Checklist */}
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-accent" />
          Quality Inspection Checklist
        </h3>

        <div className="space-y-6">
          {CHECKLIST_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title}>
                <h4 className="font-display font-medium mb-3 flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-4 w-4 text-accent" />
                  {section.title}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {section.items.map((item) => {
                    const isChecked = checkedItems[item.id];
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                          isChecked
                            ? "bg-accent/10 border-accent/30"
                            : "bg-secondary/30 border-border hover:border-accent/30"
                        }`}
                        onClick={() => handleChecklistChange(item.id, !isChecked)}
                      >
                        <Checkbox
                          id={item.id}
                          checked={isChecked}
                          onClick={(e) => e.stopPropagation()}
                          onCheckedChange={(checked) =>
                            handleChecklistChange(item.id, checked === true)
                          }
                          className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                        />
                        <Label
                          htmlFor={item.id}
                          onClick={(e) => e.stopPropagation()}
                          className={`cursor-pointer text-sm ${
                            isChecked ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {item.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
                <Separator className="mt-4" />
              </div>
            );
          })}

          {/* Keys count */}
          <div className="flex items-center gap-4">
            <Label>Number of Keys (battery + ignition):</Label>
            <Input
              type="number"
              min={0}
              value={keysCount}
              onChange={(e) => setKeysCount(parseInt(e.target.value) || 0)}
              className="w-20"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="submit" variant="brand" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit for Review"}
        </Button>
      </div>
    </form>
  );
};

export default DispatchForm;
