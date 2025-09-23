-- Add INSERT policy for profiles table to allow user registration
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Also allow the system trigger to insert profiles
CREATE POLICY "System can insert profiles for new users" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);