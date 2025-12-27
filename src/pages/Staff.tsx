import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useStaff, type Staff } from "@/hooks/useStaff";
import { Plus, Search, User, Shield, Users, Pencil, Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type StaffRole = Database["public"]["Enums"]["staff_role"];

const ROLES: { value: StaffRole; label: string }[] = [
  { value: "general_manager", label: "General Manager" },
  { value: "fleet_supervisor", label: "Fleet Supervisor" },
  { value: "telebirr_supervisor", label: "Telebirr Supervisor" },
  { value: "quality_inspector", label: "Quality Inspector" },
  { value: "sales_agent", label: "Sales Agent" },
  { value: "mechanic", label: "Mechanic" },
  { value: "marketing", label: "Marketing Team" },
];

const StaffPage = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { staff, loading, addStaff, deleteStaff } = useStaff();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", email: "", phone: "", role: "" as StaffRole | "" });

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  const handleLogout = async () => { await signOut(); navigate("/login"); };

  const filteredStaff = staff.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStaff = async () => {
    if (!newStaff.name || !newStaff.email || !newStaff.role) return;
    await addStaff({ name: newStaff.name, email: newStaff.email, phone: newStaff.phone || null, role: newStaff.role as StaffRole, is_active: true });
    setNewStaff({ name: "", email: "", phone: "", role: "" });
    setIsAddDialogOpen(false);
  };

  const getRoleLabel = (role: string) => ROLES.find((r) => r.value === role)?.label || role;
  const stats = { active: staff.filter((s) => s.is_active).length, supervisors: staff.filter((s) => s.role.includes("supervisor") || s.role === "general_manager").length, agents: staff.filter((s) => s.role === "sales_agent").length };

  if (authLoading || !user) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div></div>;

  return (
    <DashboardLayout title="Staff Management" subtitle="Manage team members and roles" user={{ name: profile?.name || "User", role: profile?.role || "user" }} onLogout={handleLogout}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="data-card"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center"><User className="h-5 w-5 text-accent" /></div><div><p className="text-2xl font-display font-bold text-foreground">{stats.active}</p><p className="text-sm text-muted-foreground">Active Staff</p></div></div></div>
        <div className="data-card"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center"><Shield className="h-5 w-5 text-blue-400" /></div><div><p className="text-2xl font-display font-bold text-foreground">{stats.supervisors}</p><p className="text-sm text-muted-foreground">Supervisors</p></div></div></div>
        <div className="data-card"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-pink-500/20 flex items-center justify-center"><Users className="h-5 w-5 text-pink-400" /></div><div><p className="text-2xl font-display font-bold text-foreground">{stats.agents}</p><p className="text-sm text-muted-foreground">Sales Agents</p></div></div></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search staff..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4 mr-2" />Add Staff</Button></DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="font-display">Add New Staff Member</DialogTitle><DialogDescription>Fill in the details to add a new team member.</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Enter full name" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@liongreen.com" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input placeholder="+251..." value={newStaff.phone} onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })} /></div>
              <div className="space-y-2"><Label>Role</Label><Select value={newStaff.role} onValueChange={(v) => setNewStaff({ ...newStaff, role: v as StaffRole })}><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger><SelectContent>{ROLES.map((role) => (<SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>))}</SelectContent></Select></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button><Button variant="brand" onClick={handleAddStaff}>Add Staff</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="glass-card overflow-hidden">
        {loading ? <div className="flex items-center justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div></div> : (
          <Table><TableHeader><TableRow className="border-border hover:bg-transparent"><TableHead className="text-muted-foreground">Name</TableHead><TableHead className="text-muted-foreground">Email</TableHead><TableHead className="text-muted-foreground">Role</TableHead><TableHead className="text-muted-foreground">Status</TableHead><TableHead className="text-muted-foreground text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>{filteredStaff.map((member) => (<TableRow key={member.id} className="border-border hover:bg-secondary/30 transition-colors"><TableCell className="font-medium text-foreground">{member.name}</TableCell><TableCell className="text-muted-foreground">{member.email}</TableCell><TableCell><span className="px-3 py-1 rounded-full text-xs font-medium border bg-accent/10 text-accent border-accent/30">{getRoleLabel(member.role)}</span></TableCell><TableCell>{member.is_active ? <span className="status-badge status-approved">Active</span> : <span className="status-badge status-rejected">Inactive</span>}</TableCell><TableCell className="text-right"><div className="flex items-center justify-end gap-2"><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteStaff(member.id)}><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StaffPage;
