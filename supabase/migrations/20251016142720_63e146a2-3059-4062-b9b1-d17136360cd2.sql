-- Fix: Allow profiles to be created during signup
-- The handle_new_user() trigger needs permission to insert into profiles
CREATE POLICY "Allow profile creation during signup"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Also ensure the trigger can insert even when no user is authenticated yet
-- by granting insert to authenticated role
GRANT INSERT ON public.profiles TO authenticated;