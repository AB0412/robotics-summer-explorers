
-- Create a table to track monthly payments for each student
CREATE TABLE public.student_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id TEXT NOT NULL REFERENCES public.registrations(registrationid) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  month_year TEXT NOT NULL, -- Format: "2024-01" for January 2024
  tuition_amount DECIMAL(10,2) DEFAULT 0.00,
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  payment_date DATE,
  payment_method TEXT, -- cash, check, online, etc.
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(registration_id, month_year) -- Prevent duplicate entries for same student/month
);

-- Enable Row Level Security
ALTER TABLE public.student_payments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users (admin) to view all payments
CREATE POLICY "Allow authenticated read access" ON public.student_payments 
  FOR SELECT TO authenticated 
  USING (true);

-- Create policy to allow authenticated users to insert payments
CREATE POLICY "Allow authenticated insert" ON public.student_payments 
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update payments
CREATE POLICY "Allow authenticated update" ON public.student_payments 
  FOR UPDATE TO authenticated
  USING (true);

-- Create policy to allow authenticated users to delete payments
CREATE POLICY "Allow authenticated delete" ON public.student_payments 
  FOR DELETE TO authenticated
  USING (true);

-- Create index for better query performance
CREATE INDEX idx_student_payments_registration_id ON public.student_payments(registration_id);
CREATE INDEX idx_student_payments_month_year ON public.student_payments(month_year);

-- Function to automatically create payment records for new registrations
CREATE OR REPLACE FUNCTION create_payment_records_for_registration()
RETURNS TRIGGER AS $$
DECLARE
  current_month TEXT;
  months_ahead INTEGER := 12; -- Create records for next 12 months
  i INTEGER;
BEGIN
  -- Create payment records for the next 12 months starting from current month
  FOR i IN 0..months_ahead-1 LOOP
    current_month := TO_CHAR(CURRENT_DATE + INTERVAL '%s months', 'YYYY-MM');
    
    INSERT INTO public.student_payments (
      registration_id,
      student_name,
      month_year,
      tuition_amount,
      is_paid
    ) VALUES (
      NEW.registrationid,
      NEW.childname,
      current_month,
      150.00, -- Default tuition amount, can be modified
      FALSE
    );
    
    -- Replace %s with actual variable
    current_month := TO_CHAR(CURRENT_DATE + (i || ' months')::INTERVAL, 'YYYY-MM');
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create payment records for new registrations
CREATE TRIGGER trigger_create_payment_records
  AFTER INSERT ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION create_payment_records_for_registration();
