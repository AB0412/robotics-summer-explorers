-- Fix the trigger function to use SECURITY DEFINER
-- This allows it to insert payment records regardless of who triggers it
DROP FUNCTION IF EXISTS public.create_payment_records_for_registration() CASCADE;

CREATE OR REPLACE FUNCTION public.create_payment_records_for_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER  -- This is the critical fix
SET search_path TO 'public'
AS $$
DECLARE
  current_month TEXT;
  months_ahead INTEGER := 12;
  i INTEGER;
BEGIN
  FOR i IN 0..months_ahead-1 LOOP
    current_month := TO_CHAR(CURRENT_DATE + (i || ' months')::INTERVAL, 'YYYY-MM');

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
      100.00,
      FALSE
    );
  END LOOP;

  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER trigger_create_payment_records
  AFTER INSERT ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION create_payment_records_for_registration();