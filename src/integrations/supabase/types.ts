export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      dispatch_records: {
        Row: {
          approved_at: string | null
          battery_charged: boolean | null
          battery_voltage_tested: boolean | null
          brakes_tested: boolean | null
          charger_cables_included: boolean | null
          charger_provided: boolean | null
          controller_functioning: boolean | null
          created_at: string
          created_by: string | null
          customer_name: string
          dashboard_operational: boolean | null
          destination_city: string
          dispatch_date: string
          dispatch_manager_id: string | null
          dispatch_manager_name: string | null
          escort_tire_included: boolean | null
          fasteners_tightened: boolean | null
          frame_inspected: boolean | null
          horn_working: boolean | null
          id: string
          invoice_included: boolean | null
          keys_count: number | null
          lights_functioning: boolean | null
          model: string
          motor_tested: boolean | null
          no_abnormal_noises: boolean | null
          photos_taken: boolean | null
          qc_inspector_id: string | null
          qc_inspector_name: string | null
          rejected_at: string | null
          rejection_reason: string | null
          serial_no: string
          speed_tested: boolean | null
          status: Database["public"]["Enums"]["dispatch_status"]
          steering_checked: boolean | null
          suspension_functioning: boolean | null
          tires_inflated: boolean | null
          toolkit_included: boolean | null
          transporter_contact: string
          transporter_name: string
          tricycle_secured: boolean | null
          truck_no: string
          updated_at: string
          user_manual_included: boolean | null
          vehicle_id: string | null
          warranty_card_included: boolean | null
          wheel_nuts_tightened: boolean | null
          wiring_inspected: boolean | null
        }
        Insert: {
          approved_at?: string | null
          battery_charged?: boolean | null
          battery_voltage_tested?: boolean | null
          brakes_tested?: boolean | null
          charger_cables_included?: boolean | null
          charger_provided?: boolean | null
          controller_functioning?: boolean | null
          created_at?: string
          created_by?: string | null
          customer_name: string
          dashboard_operational?: boolean | null
          destination_city: string
          dispatch_date?: string
          dispatch_manager_id?: string | null
          dispatch_manager_name?: string | null
          escort_tire_included?: boolean | null
          fasteners_tightened?: boolean | null
          frame_inspected?: boolean | null
          horn_working?: boolean | null
          id?: string
          invoice_included?: boolean | null
          keys_count?: number | null
          lights_functioning?: boolean | null
          model: string
          motor_tested?: boolean | null
          no_abnormal_noises?: boolean | null
          photos_taken?: boolean | null
          qc_inspector_id?: string | null
          qc_inspector_name?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          serial_no: string
          speed_tested?: boolean | null
          status?: Database["public"]["Enums"]["dispatch_status"]
          steering_checked?: boolean | null
          suspension_functioning?: boolean | null
          tires_inflated?: boolean | null
          toolkit_included?: boolean | null
          transporter_contact: string
          transporter_name: string
          tricycle_secured?: boolean | null
          truck_no: string
          updated_at?: string
          user_manual_included?: boolean | null
          vehicle_id?: string | null
          warranty_card_included?: boolean | null
          wheel_nuts_tightened?: boolean | null
          wiring_inspected?: boolean | null
        }
        Update: {
          approved_at?: string | null
          battery_charged?: boolean | null
          battery_voltage_tested?: boolean | null
          brakes_tested?: boolean | null
          charger_cables_included?: boolean | null
          charger_provided?: boolean | null
          controller_functioning?: boolean | null
          created_at?: string
          created_by?: string | null
          customer_name?: string
          dashboard_operational?: boolean | null
          destination_city?: string
          dispatch_date?: string
          dispatch_manager_id?: string | null
          dispatch_manager_name?: string | null
          escort_tire_included?: boolean | null
          fasteners_tightened?: boolean | null
          frame_inspected?: boolean | null
          horn_working?: boolean | null
          id?: string
          invoice_included?: boolean | null
          keys_count?: number | null
          lights_functioning?: boolean | null
          model?: string
          motor_tested?: boolean | null
          no_abnormal_noises?: boolean | null
          photos_taken?: boolean | null
          qc_inspector_id?: string | null
          qc_inspector_name?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          serial_no?: string
          speed_tested?: boolean | null
          status?: Database["public"]["Enums"]["dispatch_status"]
          steering_checked?: boolean | null
          suspension_functioning?: boolean | null
          tires_inflated?: boolean | null
          toolkit_included?: boolean | null
          transporter_contact?: string
          transporter_name?: string
          tricycle_secured?: boolean | null
          truck_no?: string
          updated_at?: string
          user_manual_included?: boolean | null
          vehicle_id?: string | null
          warranty_card_included?: boolean | null
          wheel_nuts_tightened?: boolean | null
          wiring_inspected?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "dispatch_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_records_dispatch_manager_id_fkey"
            columns: ["dispatch_manager_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_records_qc_inspector_id_fkey"
            columns: ["qc_inspector_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          completed: boolean
          cost: number | null
          created_at: string
          description: string
          id: string
          maintenance_date: string
          mechanic_id: string | null
          mechanic_name: string | null
          parts_replaced: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          completed?: boolean
          cost?: number | null
          created_at?: string
          description: string
          id?: string
          maintenance_date?: string
          mechanic_id?: string | null
          mechanic_name?: string | null
          parts_replaced?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          completed?: boolean
          cost?: number | null
          created_at?: string
          description?: string
          id?: string
          maintenance_date?: string
          mechanic_id?: string | null
          mechanic_name?: string | null
          parts_replaced?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          department: string | null
          email: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["staff_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          department: string | null
          email: string
          hire_date: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["staff_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          hire_date?: string
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          role: Database["public"]["Enums"]["staff_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          hire_date?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          updated_at?: string
        }
        Relationships: []
      }
      telebirr_transactions: {
        Row: {
          agent_id: string
          agent_name: string
          amount_returned: number
          approved_at: string | null
          created_at: string
          daily_income: number
          date: string
          floated_amount: number
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          supervisor_id: string | null
          total_sales: number
          updated_at: string
          variance: number | null
        }
        Insert: {
          agent_id: string
          agent_name: string
          amount_returned?: number
          approved_at?: string | null
          created_at?: string
          daily_income?: number
          date?: string
          floated_amount?: number
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          supervisor_id?: string | null
          total_sales?: number
          updated_at?: string
          variance?: number | null
        }
        Update: {
          agent_id?: string
          agent_name?: string
          amount_returned?: number
          approved_at?: string | null
          created_at?: string
          daily_income?: number
          date?: string
          floated_amount?: number
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          supervisor_id?: string | null
          total_sales?: number
          updated_at?: string
          variance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "telebirr_transactions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telebirr_transactions_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string
          customer_name: string | null
          destination_city: string | null
          dispatch_date: string | null
          id: string
          is_rented: boolean
          last_maintenance_date: string | null
          maintenance_notes: string | null
          mechanic_id: string | null
          model: string
          next_maintenance_date: string | null
          rental_end_date: string | null
          rental_start_date: string | null
          rental_terms: string | null
          serial_no: string
          status: Database["public"]["Enums"]["vehicle_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name?: string | null
          destination_city?: string | null
          dispatch_date?: string | null
          id?: string
          is_rented?: boolean
          last_maintenance_date?: string | null
          maintenance_notes?: string | null
          mechanic_id?: string | null
          model: string
          next_maintenance_date?: string | null
          rental_end_date?: string | null
          rental_start_date?: string | null
          rental_terms?: string | null
          serial_no: string
          status?: Database["public"]["Enums"]["vehicle_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string | null
          destination_city?: string | null
          dispatch_date?: string | null
          id?: string
          is_rented?: boolean
          last_maintenance_date?: string | null
          maintenance_notes?: string | null
          mechanic_id?: string | null
          model?: string
          next_maintenance_date?: string | null
          rental_end_date?: string | null
          rental_start_date?: string | null
          rental_terms?: string | null
          serial_no?: string
          status?: Database["public"]["Enums"]["vehicle_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      dispatch_status: "pending" | "approved" | "rejected"
      staff_role:
        | "general_manager"
        | "fleet_supervisor"
        | "telebirr_supervisor"
        | "sales_agent"
        | "mechanic"
        | "quality_inspector"
        | "marketing"
      transaction_status: "pending" | "approved" | "rejected"
      vehicle_status: "available" | "dispatched" | "maintenance" | "rented"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      dispatch_status: ["pending", "approved", "rejected"],
      staff_role: [
        "general_manager",
        "fleet_supervisor",
        "telebirr_supervisor",
        "sales_agent",
        "mechanic",
        "quality_inspector",
        "marketing",
      ],
      transaction_status: ["pending", "approved", "rejected"],
      vehicle_status: ["available", "dispatched", "maintenance", "rented"],
    },
  },
} as const
