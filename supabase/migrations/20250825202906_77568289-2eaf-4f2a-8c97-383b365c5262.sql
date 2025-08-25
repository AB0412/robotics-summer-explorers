-- Fix remaining function search_path security warnings
-- This completes the function security hardening

-- Fix execute_sql function
CREATE OR REPLACE FUNCTION public.execute_sql(sql text)
RETURNS void 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Fix heartbeat function
CREATE OR REPLACE FUNCTION public.heartbeat()
RETURNS boolean 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT true;
$$;

-- Fix check_table_permissions function
CREATE OR REPLACE FUNCTION public.check_table_permissions(table_name text, permission text)
RETURNS json 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This is a dummy function that will always return success
  -- since we'll be using it just to check if we have permissions
  RETURN json_build_object('has_permission', true);
END;
$$;

-- Fix get_table_columns function
CREATE OR REPLACE FUNCTION public.get_table_columns(table_name text)
RETURNS TABLE(column_name text, data_type text) 
LANGUAGE sql
SET search_path = 'information_schema', 'public'
AS $$
  SELECT column_name::text, data_type::text
  FROM information_schema.columns
  WHERE table_name = $1 AND table_schema = 'public'
$$;

-- Fix check_write_permission function
CREATE OR REPLACE FUNCTION public.check_write_permission()
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This is a dummy function that just tests write permission
  -- We use a transaction to avoid actually writing anything
  BEGIN
    -- Try to create a temporary table, which tests write permissions
    CREATE TEMP TABLE _write_test_table(id int) ON COMMIT DROP;
    DROP TABLE _write_test_table;
    RETURN true;
  EXCEPTION
    WHEN insufficient_privilege THEN
      RETURN false;
    WHEN OTHERS THEN
      RAISE NOTICE 'Unexpected error in check_write_permission: %', SQLERRM;
      RETURN false;
  END;
END;
$$;

-- Fix create_payment_records_for_registration trigger function
CREATE OR REPLACE FUNCTION public.create_payment_records_for_registration()
RETURNS trigger 
LANGUAGE plpgsql 
SET search_path = public
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