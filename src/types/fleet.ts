// Fleet / Vehicle Management Types

export type VehicleStatus = 
  | "available"
  | "dispatched"
  | "rented"
  | "maintenance"
  | "sold";

export interface MaintenanceRecord {
  id: string;
  date: string;
  description: string;
  mechanicId: string;
  mechanicName: string;
  cost?: number;
  notes?: string;
  completedAt?: string;
}

export interface RentalInfo {
  isRented: boolean;
  renterName?: string;
  renterContact?: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
  rentalTerms?: string;
  dailyRate?: number;
}

export interface Vehicle {
  id: string;
  serialNumber: string;
  model: string;
  variant: string;
  productionDate: string;
  productionSite: string;
  status: VehicleStatus;
  condition: "excellent" | "good" | "fair" | "needs_repair";
  
  // Dispatch info (if dispatched/sold)
  dispatchDate?: string;
  destinationCity?: string;
  customerName?: string;
  
  // Rental info
  rental: RentalInfo;
  
  // Maintenance
  maintenanceRecords: MaintenanceRecord[];
  nextMaintenanceDate?: string;
  flaggedForMaintenance: boolean;
  
  // Meta
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_COLORS: Record<VehicleStatus, string> = {
  available: "bg-accent/20 text-accent border-accent/30",
  dispatched: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  rented: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  maintenance: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  sold: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export const CONDITION_COLORS: Record<Vehicle["condition"], string> = {
  excellent: "text-accent",
  good: "text-blue-400",
  fair: "text-yellow-400",
  needs_repair: "text-destructive",
};
