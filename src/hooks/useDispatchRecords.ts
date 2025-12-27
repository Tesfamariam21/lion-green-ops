import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type DispatchRow = Database["public"]["Tables"]["dispatch_records"]["Row"];
type DispatchInsert = Database["public"]["Tables"]["dispatch_records"]["Insert"];
type DispatchUpdate = Database["public"]["Tables"]["dispatch_records"]["Update"];

export type DispatchRecord = DispatchRow;

export const useDispatchRecords = () => {
  const [records, setRecords] = useState<DispatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("dispatch_records")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load dispatch records",
        variant: "destructive",
      });
      console.error(error);
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  };

  const addRecord = async (recordData: DispatchInsert) => {
    const { data, error } = await supabase
      .from("dispatch_records")
      .insert([recordData])
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
      title: "Dispatch Created",
      description: `Dispatch ${recordData.serial_no} has been submitted for review.`,
    });
    setRecords((prev) => [data, ...prev]);
    return data;
  };

  const updateRecord = async (id: string, updates: DispatchUpdate) => {
    const { data, error } = await supabase
      .from("dispatch_records")
      .update(updates)
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
      title: "Record Updated",
      description: "Dispatch record has been updated.",
    });
    setRecords((prev) => prev.map((r) => (r.id === id ? data : r)));
    return data;
  };

  const approveRecord = async (id: string, managerName: string) => {
    return updateRecord(id, {
      status: "approved",
      dispatch_manager_name: managerName,
      approved_at: new Date().toISOString(),
    });
  };

  const rejectRecord = async (id: string, reason: string) => {
    return updateRecord(id, {
      status: "rejected",
      rejected_at: new Date().toISOString(),
      rejection_reason: reason,
    });
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return {
    records,
    loading,
    fetchRecords,
    addRecord,
    updateRecord,
    approveRecord,
    rejectRecord,
  };
};
