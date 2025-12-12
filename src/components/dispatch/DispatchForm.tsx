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
import { Truck, Battery, CircleDot, Gauge, Lightbulb, Wrench, LucideIcon } from "lucide-react";

interface ChecklistItemConfig {
  id: string;
  label: string;
  icon: LucideIcon;
}

const CHECKLIST_ITEMS: ChecklistItemConfig[] = [
  { id: "battery", label: "Battery Condition", icon: Battery },
  { id: "tires", label: "Tires & Wheels", icon: CircleDot },
  { id: "brakes", label: "Brake System", icon: Gauge },
  { id: "lights", label: "Lights & Signals", icon: Lightbulb },
  { id: "motor", label: "Motor Function", icon: Wrench },
  { id: "frame", label: "Frame & Body", icon: Truck },
];

const DispatchForm = () => {
  const { toast } = useToast();
  const [serialNumber, setSerialNumber] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [productionDate, setProductionDate] = useState("");
  const [notes, setNotes] = useState("");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    Object.fromEntries(CHECKLIST_ITEMS.map(item => [item.id, false]))
  );

  const handleChecklistChange = (id: string, checked: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [id]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const allChecked = CHECKLIST_ITEMS.every((item) => checkedItems[item.id]);
    if (!allChecked) {
      toast({
        title: "Incomplete Checklist",
        description: "Please complete all checklist items before submitting.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Dispatch Submitted",
      description: `Tricycle ${serialNumber} has been submitted for review.`,
    });

    // Reset form
    setSerialNumber("");
    setModel("");
    setVariant("");
    setProductionDate("");
    setNotes("");
    setCheckedItems(Object.fromEntries(CHECKLIST_ITEMS.map(item => [item.id, false])));
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
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              placeholder="e.g., LGS-2024-0001"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel} required>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eco-rider">Eco Rider</SelectItem>
                <SelectItem value="power-haul">Power Haul</SelectItem>
                <SelectItem value="city-cruiser">City Cruiser</SelectItem>
                <SelectItem value="cargo-max">Cargo Max</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="variant">Variant</Label>
            <Select value={variant} onValueChange={setVariant} required>
              <SelectTrigger>
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="heavy-duty">Heavy Duty</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="productionDate">Production Date</Label>
            <Input
              id="productionDate"
              type="date"
              value={productionDate}
              onChange={(e) => setProductionDate(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Quality Checklist */}
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Quality Inspection Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHECKLIST_ITEMS.map((item) => {
            const Icon = item.icon;
            const isChecked = checkedItems[item.id];
            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                  isChecked
                    ? "bg-accent/10 border-accent/30"
                    : "bg-secondary/30 border-border hover:border-accent/30"
                }`}
                onClick={() => handleChecklistChange(item.id, !isChecked)}
              >
                <Checkbox
                  id={item.id}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleChecklistChange(item.id, checked as boolean)
                  }
                  className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
                <div className="flex items-center gap-2 flex-1">
                  <span className={isChecked ? "text-accent" : "text-muted-foreground"}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <Label
                    htmlFor={item.id}
                    className={`cursor-pointer ${
                      isChecked ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Additional Notes</h3>
        <Textarea
          placeholder="Add any additional notes or observations..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px] bg-secondary/50 border-border"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Save Draft
        </Button>
        <Button type="submit" variant="brand" size="lg">
          Submit for Review
        </Button>
      </div>
    </form>
  );
};

export default DispatchForm;
