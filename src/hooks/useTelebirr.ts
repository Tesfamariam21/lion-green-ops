import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type TransactionRow = Database["public"]["Tables"]["telebirr_transactions"]["Row"];
type TransactionInsert = Database["public"]["Tables"]["telebirr_transactions"]["Insert"];

export type TelebirrTransaction = TransactionRow;

export const useTelebirr = () => {
  const [transactions, setTransactions] = useState<TelebirrTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("telebirr_transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
      console.error(error);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  };

  const addTransaction = async (transactionData: TransactionInsert) => {
    const { data, error } = await supabase
      .from("telebirr_transactions")
      .insert([transactionData])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Transaction Recorded",
      description: "Daily transaction has been recorded for approval.",
    });
    setTransactions((prev) => [data, ...prev]);
    return data;
  };

  const approveTransaction = async (id: string, supervisorId: string) => {
    const { data, error } = await supabase
      .from("telebirr_transactions")
      .update({
        status: "approved",
        supervisor_id: supervisorId,
        approved_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Approved",
      description: "Transaction has been approved.",
    });
    setTransactions((prev) => prev.map((t) => (t.id === id ? data : t)));
    return data;
  };

  const rejectTransaction = async (id: string) => {
    const { data, error } = await supabase
      .from("telebirr_transactions")
      .update({ status: "rejected" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Rejected",
      description: "Transaction has been rejected.",
      variant: "destructive",
    });
    setTransactions((prev) => prev.map((t) => (t.id === id ? data : t)));
    return data;
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Calculate stats
  const stats = {
    totalFloated: transactions.reduce((sum, t) => sum + Number(t.floated_amount), 0),
    totalSales: transactions.reduce((sum, t) => sum + Number(t.total_sales), 0),
    totalIncome: transactions.reduce((sum, t) => sum + Number(t.daily_income), 0),
    pendingCount: transactions.filter((t) => t.status === "pending").length,
  };

  return {
    transactions,
    loading,
    stats,
    fetchTransactions,
    addTransaction,
    approveTransaction,
    rejectTransaction,
  };
};
