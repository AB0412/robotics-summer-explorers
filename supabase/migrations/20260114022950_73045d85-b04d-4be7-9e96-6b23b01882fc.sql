
-- Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('admin', 'parent');

-- Create user_roles table (following security best practices - roles separate from profiles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'parent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursive RLS issues)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create registrations table
CREATE TABLE public.registrations (
  id SERIAL PRIMARY KEY,
  registrationid TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  parentname TEXT NOT NULL,
  parentemail TEXT NOT NULL,
  parentphone TEXT NOT NULL,
  emergencycontact TEXT NOT NULL,
  childname TEXT NOT NULL,
  childage TEXT NOT NULL,
  childgrade TEXT NOT NULL,
  schoolname TEXT NOT NULL,
  medicalinfo TEXT,
  programtype TEXT NOT NULL DEFAULT 'regular',
  preferredbatch TEXT NOT NULL,
  alternatebatch TEXT,
  haspriorexperience TEXT NOT NULL,
  experiencedescription TEXT,
  interestlevel TEXT,
  referralsource TEXT NOT NULL,
  photoconsent BOOLEAN NOT NULL DEFAULT FALSE,
  waiveragreement BOOLEAN NOT NULL DEFAULT FALSE,
  tshirtsize TEXT,
  specialrequests TEXT,
  volunteerinterest BOOLEAN NOT NULL DEFAULT FALSE,
  submittedat TEXT NOT NULL
);

-- Enable RLS on registrations
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create student_payments table
CREATE TABLE public.student_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id TEXT NOT NULL REFERENCES public.registrations(registrationid) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  month_year TEXT NOT NULL,
  tuition_amount DECIMAL(10,2) DEFAULT 0.00,
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  payment_date DATE,
  payment_method TEXT,
  notes TEXT,
  receipt_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(registration_id, month_year)
);

-- Enable RLS on student_payments
ALTER TABLE public.student_payments ENABLE ROW LEVEL SECURITY;

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'parent');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to create payment records for new registrations
CREATE OR REPLACE FUNCTION public.create_payment_records_for_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  months TEXT[] := ARRAY['June 2025', 'July 2025'];
  month TEXT;
BEGIN
  FOREACH month IN ARRAY months
  LOOP
    INSERT INTO public.student_payments (registration_id, student_name, month_year, tuition_amount)
    VALUES (NEW.registrationid, NEW.childname, month, 0.00)
    ON CONFLICT (registration_id, month_year) DO NOTHING;
  END LOOP;
  RETURN NEW;
END;
$$;

-- Trigger for payment records creation
CREATE TRIGGER create_payment_records_trigger
  AFTER INSERT ON public.registrations
  FOR EACH ROW EXECUTE FUNCTION public.create_payment_records_for_registration();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_payments_updated_at
  BEFORE UPDATE ON public.student_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for registrations
CREATE POLICY "Anyone can insert registrations"
  ON public.registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own registrations"
  ON public.registrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all registrations"
  ON public.registrations FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update registrations"
  ON public.registrations FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete registrations"
  ON public.registrations FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for student_payments
CREATE POLICY "Admins can view all payments"
  ON public.student_payments FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert payments"
  ON public.student_payments FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update payments"
  ON public.student_payments FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete payments"
  ON public.student_payments FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create receipts storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false);

-- Storage policies for receipts
CREATE POLICY "Admins can upload receipts"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'receipts' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view receipts"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'receipts' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete receipts"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'receipts' AND public.has_role(auth.uid(), 'admin'));
