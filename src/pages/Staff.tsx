import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { mockStaffMembers } from "@/data/mockStaffData";
import { StaffMember, StaffRole, ROLE_COLORS, ProductCategory } from "@/types/staff";
import { Plus, Search, User, Shield, Users, Pencil, Trash2 } from "lucide-react";

const ROLES: StaffRole[] = [
  "General Manager",
  "Fleet Supervisor",
  "Telebirr Supervisor",
  "Dispatch Manager",
  "Quality Inspector",
  "Sales Agent",
  "Mechanic",
  "Marketing Team",
];

const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Electric Tricycle",
  "Spare Parts",
  "Batteries",
  "Accessories",
];

const Staff = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>(mockStaffMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "" as StaffRole | "",
    productCategory: "" as ProductCategory | "",
  });

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

  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email || !newStaff.role) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newMember: StaffMember = {
      id: Date.now().toString(),
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      role: newStaff.role as StaffRole,
      productCategory: newStaff.role === "Sales Agent" ? newStaff.productCategory as ProductCategory : undefined,
      status: "active",
      joinedAt: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };

    setStaff([...staff, newMember]);
    setNewStaff({ name: "", email: "", phone: "", role: "", productCategory: "" });
    setIsAddDialogOpen(false);
    toast({ title: "Staff Added", description: `${newMember.name} has been added to the team.` });
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id));
    toast({ title: "Staff Removed", description: "Staff member has been removed." });
  };

  const getRoleBadge = (role: StaffRole) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${ROLE_COLORS[role]}`}>
      {role}
    </span>
  );

  const getStatusBadge = (status: StaffMember["status"]) => (
    status === "active" ? (
      <span className="status-badge status-approved">Active</span>
    ) : (
      <span className="status-badge status-rejected">Inactive</span>
    )
  );

  const stats = {
    active: staff.filter((s) => s.status === "active").length,
    supervisors: staff.filter((s) => s.role.includes("Supervisor") || s.role === "General Manager").length,
    agents: staff.filter((s) => s.role === "Sales Agent").length,
  };

  if (!user) return null;

  return (
    <DashboardLayout title="Staff Management" subtitle="Manage team members and roles" user={user} onLogout={handleLogout}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <User className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active Staff</p>
            </div>
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{stats.supervisors}</p>
              <p className="text-sm text-muted-foreground">Supervisors</p>
            </div>
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{stats.agents}</p>
              <p className="text-sm text-muted-foreground">Sales Agents</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search staff..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="brand"><Plus className="h-4 w-4 mr-2" />Add Staff</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display">Add New Staff Member</DialogTitle>
              <DialogDescription>Fill in the details to add a new team member.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Enter full name" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@liongreen.com" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+251..." value={newStaff.phone} onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newStaff.role} onValueChange={(v) => setNewStaff({ ...newStaff, role: v as StaffRole })}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (<SelectItem key={role} value={role}>{role}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              {newStaff.role === "Sales Agent" && (
                <div className="space-y-2">
                  <Label>Product Category</Label>
                  <Select value={newStaff.productCategory} onValueChange={(v) => setNewStaff({ ...newStaff, productCategory: v as ProductCategory })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button variant="brand" onClick={handleAddStaff}>Add Staff</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Email</TableHead>
              <TableHead className="text-muted-foreground">Role</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.map((member) => (
              <TableRow key={member.id} className="border-border hover:bg-secondary/30 transition-colors">
                <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                <TableCell className="text-muted-foreground">{member.email}</TableCell>
                <TableCell>{getRoleBadge(member.role)}</TableCell>
                <TableCell>{getStatusBadge(member.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteStaff(member.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Staff;