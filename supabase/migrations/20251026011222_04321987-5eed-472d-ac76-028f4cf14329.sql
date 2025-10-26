-- Grant INSERT permission on registrations table to anon and authenticated roles
GRANT INSERT ON TABLE public.registrations TO anon;
GRANT INSERT ON TABLE public.registrations TO authenticated;

-- Also grant USAGE on the sequence used for the id column
GRANT USAGE, SELECT ON SEQUENCE public.registrations_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.registrations_id_seq TO authenticated;