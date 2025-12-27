import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"];
type VehicleInsert = Database["public"]["Tables"]["vehicles"]["Insert"];
type VehicleUpdate = Database["public"]["Tables"]["vehicles"]["Update"];

export type Vehicle = VehicleRow;

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load vehicles",
        variant: "destructive",
      });
      console.error(error);
    } else {
      setVehicles(data || []);
    }
    setLoading(false);
  };

  const addVehicle = async (vehicleData: VehicleInsert) => {
    const { data, error } = await supabase
      .from("vehicles")
      .insert([vehicleData])
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
      title: "Vehicle Added",
      description: `Vehicle ${vehicleData.serial_no} has been added.`,
    });
    setVehicles((prev) => [data, ...prev]);
    return data;
  };

  const updateVehicle = async (id: string, updates: VehicleUpdate) => {
    const { data, error } = await supabase
      .from("vehicles")
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
      title: "Vehicle Updated",
      description: "Vehicle information has been updated.",
    });
    setVehicles((prev) => prev.map((v) => (v.id === id ? data : v)));
    return data;
  };

  const deleteVehicle = async (id: string) => {
    const { error } = await supabase.from("vehicles").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Vehicle Removed",
      description: "Vehicle has been removed.",
    });
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    return true;
  };

  const flagForMaintenance = async (id: string) => {
    return updateVehicle(id, { status: "maintenance" });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    loading,
    fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    flagForMaintenance,
  };
};
