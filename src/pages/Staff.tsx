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
import { Plus, Search, User, Shield, Eye, Pencil, Trash2 } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Dispatch Manager" | "Quality Inspector";
  status: "active" | "inactive";
  joinedAt: string;
}

const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@liongreen.com",
    role: "Quality Inspector",
    status: "active",
    joinedAt: "2023-06-15",
  },
  {
    id: "2",
    name: "Sarah Lee",
    email: "sarah.lee@liongreen.com",
    role: "Quality Inspector",
    status: "active",
    joinedAt: "2023-08-20",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@liongreen.com",
    role: "Dispatch Manager",
    status: "active",
    joinedAt: "2023-03-10",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@liongreen.com",
    role: "Admin",
    status: "active",
    joinedAt: "2022-12-01",
  },
  {
    id: "5",
    name: "Tom Wilson",
    email: "tom.wilson@liongreen.com",
    role: "Quality Inspector",
    status: "inactive",
    joinedAt: "2023-09-05",
  },
];

const Staff = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    role: "" as StaffMember["role"] | "",
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
      role: newStaff.role as StaffMember["role"],
      status: "active",
      joinedAt: new Date().toISOString().split("T")[0],
    };

    setStaff([...staff, newMember]);
    setNewStaff({ name: "", email: "", role: "" });
    setIsAddDialogOpen(false);
    toast({
      title: "Staff Added",
      description: `${newMember.name} has been added to the team.`,
    });
  };

  const getRoleBadge = (role: StaffMember["role"]) => {
    const colors = {
      Admin: "bg-accent/20 text-accent border-accent/30",
      "Dispatch Manager": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "Quality Inspector": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[role]}`}>
        {role}
      </span>
    );
  };

  const getStatusBadge = (status: StaffMember["status"]) => {
    return status === "active" ? (
      <span className="status-badge status-approved">Active</span>
    ) : (
      <span className="status-badge status-rejected">Inactive</span>
    );
  };

  if (!user) return null;

  return (
    <DashboardLayout
      title="Staff Management"
      subtitle="Manage team members and roles"
      user={user}
      onLogout={handleLogout}
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="brand">
              <Plus className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display">Add New Staff Member</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new team member.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@liongreen.com"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newStaff.role}
                  onValueChange={(value) =>
                    setNewStaff({ ...newStaff, role: value as StaffMember["role"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Dispatch Manager">Dispatch Manager</SelectItem>
                    <SelectItem value="Quality Inspector">Quality Inspector</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="brand" onClick={handleAddStaff}>
                Add Staff
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <User className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">
                {staff.filter((s) => s.status === "active").length}
              </p>
              <p className="text-sm text-muted-foreground">Active Staff</p>
            </div>
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Eye className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">
                {staff.filter((s) => s.role === "Quality Inspector").length}
              </p>
              <p className="text-sm text-muted-foreground">Inspectors</p>
            </div>
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">
                {staff.filter((s) => s.role === "Admin" || s.role === "Dispatch Manager").length}
              </p>
              <p className="text-sm text-muted-foreground">Managers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Email</TableHead>
              <TableHead className="text-muted-foreground">Role</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Joined</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.map((member) => (
              <TableRow
                key={member.id}
                className="border-border hover:bg-secondary/30 transition-colors"
              >
                <TableCell className="font-medium text-foreground">
                  {member.name}
                </TableCell>
                <TableCell className="text-muted-foreground">{member.email}</TableCell>
                <TableCell>{getRoleBadge(member.role)}</TableCell>
                <TableCell>{getStatusBadge(member.status)}</TableCell>
                <TableCell className="text-muted-foreground">{member.joinedAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                    >
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
