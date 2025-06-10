
-- Fix the create_payment_records_for_registration function
CREATE OR REPLACE FUNCTION create_payment_records_for_registration()
RETURNS TRIGGER AS $$
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
      150.00, -- Default tuition amount, can be modified
      FALSE
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
