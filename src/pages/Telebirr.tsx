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
import { mockTransactions, mockAgentPerformance } from "@/data/mockTelebirrData";
import { DailyTransaction, AgentPerformance, TRANSACTION_STATUS_COLORS } from "@/types/telebirr";
import {
  Plus,
  Search,
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const Telebirr = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [transactions, setTransactions] = useState<DailyTransaction[]>(mockTransactions);
  const [agentPerformance] = useState<AgentPerformance[]>(mockAgentPerformance);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selectedTransaction, setSelectedTransaction] = useState<DailyTransaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    agentId: "",
    agentName: "",
    floatedAmount: 0,
    totalSales: 0,
    dailyIncome: 0,
    amountReturned: 0,
    notes: "",
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

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.date.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (transactionId: string) => {
    setTransactions(
      transactions.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              status: "approved" as const,
              supervisorId: "sup1",
              supervisorName: user?.name || "Supervisor",
              approvedAt: new Date().toISOString(),
            }
          : t
      )
    );
    setIsDetailOpen(false);
    toast({ title: "Approved", description: "Transaction has been approved." });
  };

  const handleReject = (transactionId: string, reason: string) => {
    setTransactions(
      transactions.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              status: "rejected" as const,
              rejectionReason: reason,
            }
          : t
      )
    );
    setIsDetailOpen(false);
    toast({ title: "Rejected", description: "Transaction has been rejected.", variant: "destructive" });
  };

  const handleAddTransaction = () => {
    const variance =
      newTransaction.floatedAmount -
      newTransaction.amountReturned -
      (newTransaction.totalSales - newTransaction.dailyIncome);

    const transaction: DailyTransaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      agentId: newTransaction.agentId,
      agentName: newTransaction.agentName,
      floatedAmount: newTransaction.floatedAmount,
      totalSales: newTransaction.totalSales,
      dailyIncome: newTransaction.dailyIncome,
      amountReturned: newTransaction.amountReturned,
      variance,
      status: "pending",
      notes: newTransaction.notes,
      createdAt: new Date().toISOString(),
    };

    setTransactions([transaction, ...transactions]);
    setIsAddOpen(false);
    setNewTransaction({
      agentId: "",
      agentName: "",
      floatedAmount: 0,
      totalSales: 0,
      dailyIncome: 0,
      amountReturned: 0,
      notes: "",
    });
    toast({ title: "Transaction Recorded", description: "Daily transaction has been recorded for approval." });
  };

  const getStatusBadge = (status: DailyTransaction["status"]) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${TRANSACTION_STATUS_COLORS[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const stats = {
    totalFloated: transactions.reduce((sum, t) => sum + t.floatedAmount, 0),
    totalSales: transactions.reduce((sum, t) => sum + t.totalSales, 0),
    totalIncome: transactions.reduce((sum, t) => sum + t.dailyIncome, 0),
    pendingCount: transactions.filter((t) => t.status === "pending").length,
  };

  const chartData = agentPerformance.map((agent) => ({
    name: agent.agentName.split(" ")[0],
    sales: agent.totalSales / 1000,
    income: agent.totalIncome / 1000,
  }));

  if (!user) return null;

  return (
    <DashboardLayout
      title="Telebirr Cash Tracking"
      subtitle="Manage daily cash flow and agent transactions"
      user={user}
      onLogout={handleLogout}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xl font-display font-bold text-foreground">
                ETB {(stats.totalFloated / 1000).toFixed(0)}K
              </p>
              <p className="text-sm text-muted-foreground">Total Floated</p>
            </div>
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-display font-bold text-foreground">
                ETB {(stats.totalSales / 1000).toFixed(0)}K
              </p>
              <p className="text-sm text-muted-foreground">Total Sales</p>
            </div>
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-display font-bold text-foreground">
                ETB {(stats.totalIncome / 1000).toFixed(0)}K
              </p>
              <p className="text-sm text-muted-foreground">Total Income</p>
            </div>
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{stats.pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending Approval</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="transactions">Daily Transactions</TabsTrigger>
          <TabsTrigger value="performance">Agent Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by agent or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="brand" onClick={() => setIsAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Record Transaction
            </Button>
          </div>

          {/* Transactions Table */}
          <div className="glass-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Agent</TableHead>
                  <TableHead className="text-muted-foreground">Floated</TableHead>
                  <TableHead className="text-muted-foreground">Sales</TableHead>
                  <TableHead className="text-muted-foreground">Returned</TableHead>
                  <TableHead className="text-muted-foreground">Variance</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="border-border hover:bg-secondary/30 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setIsDetailOpen(true);
                    }}
                  >
                    <TableCell className="font-medium text-foreground">{transaction.date}</TableCell>
                    <TableCell className="text-foreground">{transaction.agentName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      ETB {transaction.floatedAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      ETB {transaction.totalSales.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      ETB {transaction.amountReturned.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          transaction.variance === 0
                            ? "text-accent"
                            : transaction.variance < 0
                            ? "text-destructive"
                            : "text-yellow-400"
                        }
                      >
                        {transaction.variance === 0
                          ? "Balanced"
                          : `ETB ${transaction.variance.toLocaleString()}`}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTransaction(transaction);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <div className="glass-card p-6">
              <h3 className="font-display text-lg text-foreground mb-4">Agent Sales Performance (in Thousands)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="sales" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Agent List */}
            <div className="glass-card p-6">
              <h3 className="font-display text-lg text-foreground mb-4">Agent Summary</h3>
              <div className="space-y-4">
                {agentPerformance.map((agent) => (
                  <div
                    key={agent.agentId}
                    className="p-4 rounded-lg bg-secondary/30 border border-border"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-foreground">{agent.agentName}</h4>
                      <span className="text-accent font-display">
                        {agent.complianceRate}% Compliance
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Sales:</span>
                        <span className="ml-2 text-foreground">
                          ETB {(agent.totalSales / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Transactions:</span>
                        <span className="ml-2 text-foreground">{agent.totalTransactions}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Daily:</span>
                        <span className="ml-2 text-foreground">
                          ETB {agent.averageDailySales.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Active:</span>
                        <span className="ml-2 text-foreground">{agent.lastTransactionDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Transaction Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Transaction Details</DialogTitle>
            <DialogDescription>
              {selectedTransaction?.date} - {selectedTransaction?.agentName}
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Floated Amount</Label>
                  <p className="text-lg font-medium text-foreground">
                    ETB {selectedTransaction.floatedAmount.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Total Sales</Label>
                  <p className="text-lg font-medium text-foreground">
                    ETB {selectedTransaction.totalSales.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Daily Income</Label>
                  <p className="text-lg font-medium text-accent">
                    ETB {selectedTransaction.dailyIncome.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Amount Returned</Label>
                  <p className="text-lg font-medium text-foreground">
                    ETB {selectedTransaction.amountReturned.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Variance</span>
                  <span
                    className={`text-lg font-display font-bold ${
                      selectedTransaction.variance === 0
                        ? "text-accent"
                        : selectedTransaction.variance < 0
                        ? "text-destructive"
                        : "text-yellow-400"
                    }`}
                  >
                    {selectedTransaction.variance === 0
                      ? "Balanced ✓"
                      : `ETB ${selectedTransaction.variance.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {selectedTransaction.notes && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Notes</Label>
                  <p className="text-foreground">{selectedTransaction.notes}</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Label className="text-muted-foreground">Status:</Label>
                {getStatusBadge(selectedTransaction.status)}
              </div>

              {selectedTransaction.status === "approved" && (
                <div className="text-sm text-muted-foreground">
                  Approved by {selectedTransaction.supervisorName} on{" "}
                  {new Date(selectedTransaction.approvedAt!).toLocaleString()}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-4">
            {selectedTransaction?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="text-destructive"
                  onClick={() => handleReject(selectedTransaction.id, "Verification needed")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button variant="brand" onClick={() => handleApprove(selectedTransaction.id)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Record Daily Transaction</DialogTitle>
            <DialogDescription>Enter the daily cash flow details for an agent.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Agent</Label>
              <Select
                value={newTransaction.agentId}
                onValueChange={(v) => {
                  const agent = mockAgentPerformance.find((a) => a.agentId === v);
                  setNewTransaction({
                    ...newTransaction,
                    agentId: v,
                    agentName: agent?.agentName || "",
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  {mockAgentPerformance.map((agent) => (
                    <SelectItem key={agent.agentId} value={agent.agentId}>
                      {agent.agentName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Floated Amount (ETB)</Label>
                <Input
                  type="number"
                  value={newTransaction.floatedAmount || ""}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, floatedAmount: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Total Sales (ETB)</Label>
                <Input
                  type="number"
                  value={newTransaction.totalSales || ""}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, totalSales: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Daily Income (ETB)</Label>
                <Input
                  type="number"
                  value={newTransaction.dailyIncome || ""}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, dailyIncome: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Amount Returned (ETB)</Label>
                <Input
                  type="number"
                  value={newTransaction.amountReturned || ""}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, amountReturned: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={newTransaction.notes}
                onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
                placeholder="Optional notes..."
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="brand" onClick={handleAddTransaction}>
              Record Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Telebirr;
