import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type StaffRow = Database["public"]["Tables"]["staff"]["Row"];
type StaffInsert = Database["public"]["Tables"]["staff"]["Insert"];
type StaffUpdate = Database["public"]["Tables"]["staff"]["Update"];

export type Staff = StaffRow;

export const useStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStaff = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load staff data",
        variant: "destructive",
      });
      console.error(error);
    } else {
      setStaff(data || []);
    }
    setLoading(false);
  };

  const addStaff = async (staffData: StaffInsert) => {
    const { data, error } = await supabase
      .from("staff")
      .insert([staffData])
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
      title: "Staff Added",
      description: `${staffData.name} has been added to the team.`,
    });
    setStaff((prev) => [data, ...prev]);
    return data;
  };

  const updateStaff = async (id: string, updates: StaffUpdate) => {
    const { data, error } = await supabase
      .from("staff")
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
      title: "Staff Updated",
      description: "Staff information has been updated.",
    });
    setStaff((prev) => prev.map((s) => (s.id === id ? data : s)));
    return data;
  };

  const deleteStaff = async (id: string) => {
    const { error } = await supabase.from("staff").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Staff Removed",
      description: "Staff member has been removed.",
    });
    setStaff((prev) => prev.filter((s) => s.id !== id));
    return true;
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return {
    staff,
    loading,
    fetchStaff,
    addStaff,
    updateStaff,
    deleteStaff,
  };
};
