-- Create enum for staff roles
CREATE TYPE public.staff_role AS ENUM (
  'general_manager',
  'fleet_supervisor',
  'telebirr_supervisor',
  'sales_agent',
  'mechanic',
  'quality_inspector',
  'marketing'
);

-- Create enum for vehicle status
CREATE TYPE public.vehicle_status AS ENUM (
  'available',
  'dispatched',
  'maintenance',
  'rented'
);

-- Create enum for dispatch status
CREATE TYPE public.dispatch_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

-- Create enum for transaction status
CREATE TYPE public.transaction_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

-- Profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role staff_role NOT NULL DEFAULT 'sales_agent',
  phone TEXT,
  department TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Staff table for all employees
CREATE TABLE public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role staff_role NOT NULL,
  department TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vehicles/Fleet table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model TEXT NOT NULL,
  serial_no TEXT NOT NULL UNIQUE,
  status vehicle_status NOT NULL DEFAULT 'available',
  destination_city TEXT,
  customer_name TEXT,
  dispatch_date DATE,
  is_rented BOOLEAN NOT NULL DEFAULT false,
  rental_start_date DATE,
  rental_end_date DATE,
  rental_terms TEXT,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  maintenance_notes TEXT,
  mechanic_id UUID REFERENCES public.staff(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Dispatch records table
CREATE TABLE public.dispatch_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  model TEXT NOT NULL,
  serial_no TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  transporter_name TEXT NOT NULL,
  transporter_contact TEXT NOT NULL,
  truck_no TEXT NOT NULL,
  dispatch_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status dispatch_status NOT NULL DEFAULT 'pending',
  
  -- Pre-dispatch checklist
  battery_charged BOOLEAN DEFAULT false,
  battery_voltage_tested BOOLEAN DEFAULT false,
  charger_provided BOOLEAN DEFAULT false,
  wiring_inspected BOOLEAN DEFAULT false,
  lights_functioning BOOLEAN DEFAULT false,
  horn_working BOOLEAN DEFAULT false,
  dashboard_operational BOOLEAN DEFAULT false,
  tires_inflated BOOLEAN DEFAULT false,
  wheel_nuts_tightened BOOLEAN DEFAULT false,
  brakes_tested BOOLEAN DEFAULT false,
  suspension_functioning BOOLEAN DEFAULT false,
  steering_checked BOOLEAN DEFAULT false,
  frame_inspected BOOLEAN DEFAULT false,
  fasteners_tightened BOOLEAN DEFAULT false,
  motor_tested BOOLEAN DEFAULT false,
  controller_functioning BOOLEAN DEFAULT false,
  speed_tested BOOLEAN DEFAULT false,
  no_abnormal_noises BOOLEAN DEFAULT false,
  invoice_included BOOLEAN DEFAULT false,
  warranty_card_included BOOLEAN DEFAULT false,
  user_manual_included BOOLEAN DEFAULT false,
  escort_tire_included BOOLEAN DEFAULT false,
  toolkit_included BOOLEAN DEFAULT false,
  charger_cables_included BOOLEAN DEFAULT false,
  keys_count INTEGER DEFAULT 0,
  tricycle_secured BOOLEAN DEFAULT false,
  photos_taken BOOLEAN DEFAULT false,
  
  -- Approval section
  qc_inspector_id UUID REFERENCES public.staff(id),
  qc_inspector_name TEXT,
  dispatch_manager_id UUID REFERENCES public.staff(id),
  dispatch_manager_name TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Telebirr transactions table
CREATE TABLE public.telebirr_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.staff(id) NOT NULL,
  agent_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  floated_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  daily_income DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_sales DECIMAL(12,2) NOT NULL DEFAULT 0,
  amount_returned DECIMAL(12,2) NOT NULL DEFAULT 0,
  variance DECIMAL(12,2) GENERATED ALWAYS AS (floated_amount - amount_returned) STORED,
  status transaction_status NOT NULL DEFAULT 'pending',
  supervisor_id UUID REFERENCES public.staff(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Maintenance records table
CREATE TABLE public.maintenance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  mechanic_id UUID REFERENCES public.staff(id),
  mechanic_name TEXT,
  maintenance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  parts_replaced TEXT,
  cost DECIMAL(10,2),
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin settings for access codes
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default admin access code
INSERT INTO public.admin_settings (setting_key, setting_value) VALUES ('admin_access_code', 'LGS2024');

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatch_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telebirr_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for staff (authenticated users can view)
CREATE POLICY "Authenticated users can view staff" ON public.staff FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert staff" ON public.staff FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update staff" ON public.staff FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete staff" ON public.staff FOR DELETE TO authenticated USING (true);

-- RLS Policies for vehicles
CREATE POLICY "Authenticated users can view vehicles" ON public.vehicles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert vehicles" ON public.vehicles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update vehicles" ON public.vehicles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete vehicles" ON public.vehicles FOR DELETE TO authenticated USING (true);

-- RLS Policies for dispatch_records
CREATE POLICY "Authenticated users can view dispatches" ON public.dispatch_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert dispatches" ON public.dispatch_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update dispatches" ON public.dispatch_records FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete dispatches" ON public.dispatch_records FOR DELETE TO authenticated USING (true);

-- RLS Policies for telebirr_transactions
CREATE POLICY "Authenticated users can view transactions" ON public.telebirr_transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert transactions" ON public.telebirr_transactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update transactions" ON public.telebirr_transactions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete transactions" ON public.telebirr_transactions FOR DELETE TO authenticated USING (true);

-- RLS Policies for maintenance_records
CREATE POLICY "Authenticated users can view maintenance" ON public.maintenance_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert maintenance" ON public.maintenance_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update maintenance" ON public.maintenance_records FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete maintenance" ON public.maintenance_records FOR DELETE TO authenticated USING (true);

-- RLS Policies for admin_settings (read-only for authenticated)
CREATE POLICY "Authenticated users can view settings" ON public.admin_settings FOR SELECT TO authenticated USING (true);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::staff_role, 'quality_inspector')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add update triggers for all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dispatch_records_updated_at BEFORE UPDATE ON public.dispatch_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_telebirr_updated_at BEFORE UPDATE ON public.telebirr_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON public.maintenance_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();