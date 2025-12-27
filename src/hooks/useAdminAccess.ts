import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAccess = () => {
  const [adminCode, setAdminCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminCode = async () => {
      const { data, error } = await supabase
        .from("admin_settings")
        .select("setting_value")
        .eq("setting_key", "admin_access_code")
        .maybeSingle();

      if (!error && data) {
        setAdminCode(data.setting_value);
      }
      setLoading(false);
    };

    fetchAdminCode();
  }, []);

  const verifyAccessCode = (code: string): boolean => {
    return code === adminCode;
  };

  return {
    loading,
    verifyAccessCode,
  };
};
