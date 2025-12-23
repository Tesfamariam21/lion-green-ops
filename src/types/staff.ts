// Staff Management Types

export type StaffRole = 
  | "General Manager"
  | "Fleet Supervisor"
  | "Telebirr Supervisor"
  | "Sales Agent"
  | "Mechanic"
  | "Marketing Team"
  | "Quality Inspector"
  | "Dispatch Manager";

export type ProductCategory = 
  | "Electric Tricycle"
  | "Spare Parts"
  | "Batteries"
  | "Accessories";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  productCategory?: ProductCategory; // For Sales Agents
  status: "active" | "inactive";
  joinedAt: string;
  createdAt: string;
}

export const ROLE_HIERARCHY: Record<StaffRole, number> = {
  "General Manager": 1,
  "Fleet Supervisor": 2,
  "Telebirr Supervisor": 2,
  "Dispatch Manager": 3,
  "Quality Inspector": 4,
  "Sales Agent": 5,
  "Mechanic": 5,
  "Marketing Team": 5,
};

export const ROLE_COLORS: Record<StaffRole, string> = {
  "General Manager": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Fleet Supervisor": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Telebirr Supervisor": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Dispatch Manager": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Quality Inspector": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Sales Agent": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Mechanic": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Marketing Team": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};
