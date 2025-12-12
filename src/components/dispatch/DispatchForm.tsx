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
import { Truck, Battery, CircleDot, Gauge, Lightbulb, Wrench } from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  checked: boolean;
}

const DispatchForm = () => {
  const { toast } = useToast();
  const [serialNumber, setSerialNumber] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [productionDate, setProductionDate] = useState("");
  const [notes, setNotes] = useState("");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "battery", label: "Battery Condition", icon: <Battery className="h-4 w-4" />, checked: false },
    { id: "tires", label: "Tires & Wheels", icon: <CircleDot className="h-4 w-4" />, checked: false },
    { id: "brakes", label: "Brake System", icon: <Gauge className="h-4 w-4" />, checked: false },
    { id: "lights", label: "Lights & Signals", icon: <Lightbulb className="h-4 w-4" />, checked: false },
    { id: "motor", label: "Motor Function", icon: <Wrench className="h-4 w-4" />, checked: false },
    { id: "frame", label: "Frame & Body", icon: <Truck className="h-4 w-4" />, checked: false },
  ]);

  const handleChecklistChange = (id: string, checked: boolean) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const allChecked = checklist.every((item) => item.checked);
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
    setChecklist((prev) => prev.map((item) => ({ ...item, checked: false })));
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
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                item.checked
                  ? "bg-accent/10 border-accent/30"
                  : "bg-secondary/30 border-border hover:border-accent/30"
              }`}
              onClick={() => handleChecklistChange(item.id, !item.checked)}
            >
              <Checkbox
                id={item.id}
                checked={item.checked}
                onCheckedChange={(checked) =>
                  handleChecklistChange(item.id, checked as boolean)
                }
                className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
              />
              <div className="flex items-center gap-2 flex-1">
                <span className={item.checked ? "text-accent" : "text-muted-foreground"}>
                  {item.icon}
                </span>
                <Label
                  htmlFor={item.id}
                  className={`cursor-pointer ${
                    item.checked ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Label>
              </div>
            </div>
          ))}
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
