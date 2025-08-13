-- Add explicit search_path to satisfy linter for this function
CREATE OR REPLACE FUNCTION public.create_payment_records_for_registration()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
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
$function$;