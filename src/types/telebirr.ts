// Telebirr Cash Tracking Types

export type TransactionType = "float" | "income" | "return";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface DailyTransaction {
  id: string;
  date: string;
  agentId: string;
  agentName: string;
  
  // Cash flow
  floatedAmount: number; // Amount given to agent by GM
  totalSales: number; // Total sales made
  dailyIncome: number; // Profit/income from sales
  amountReturned: number; // Amount returned to company
  
  // Calculated
  variance: number; // Difference (floated - returned - income kept)
  
  // Approval
  status: ApprovalStatus;
  supervisorId?: string;
  supervisorName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  
  // Meta
  notes?: string;
  createdAt: string;
}

export interface WeeklyReport {
  id: string;
  weekStart: string;
  weekEnd: string;
  agentId: string;
  agentName: string;
  
  totalFloated: number;
  totalSales: number;
  totalIncome: number;
  totalReturned: number;
  totalVariance: number;
  
  transactionCount: number;
  status: ApprovalStatus;
  
  createdAt: string;
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  totalTransactions: number;
  totalSales: number;
  totalIncome: number;
  averageDailySales: number;
  complianceRate: number; // Percentage of on-time returns
  lastTransactionDate: string;
}

export const TRANSACTION_STATUS_COLORS: Record<ApprovalStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  approved: "bg-accent/20 text-accent border-accent/30",
  rejected: "bg-destructive/20 text-destructive border-destructive/30",
};
