-- Set default tuition to 100 and update existing records
ALTER TABLE public.student_payments
  ALTER COLUMN tuition_amount SET DEFAULT 100.00;

-- Update all existing payment records to 100.00
UPDATE public.student_payments
SET tuition_amount = 100.00;

-- Ensure the function that creates payment records uses 100.00
CREATE OR REPLACE FUNCTION public.create_payment_records_for_registration()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  current_month TEXT;
  months_ahead INTEGER := 12; -- Create records for next 12 months
  i INTEGER;
BEGIN
  -- Create payment records for the next 12 months starting from current month
  FOR i IN 0..months_ahead-1 LOOP
    -- Calculate the month/year for this iteration
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
      100.00, -- Updated default tuition amount
      FALSE
    );
  END LOOP;

  RETURN NEW;
END;
$function$;