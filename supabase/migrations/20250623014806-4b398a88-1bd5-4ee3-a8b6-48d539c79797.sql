
-- First, completely drop the constraint to avoid any conflicts
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS check_programtype;

-- Update all existing data to use 'regular' instead of old values
UPDATE registrations 
SET programtype = 'regular' 
WHERE programtype != 'regular';

-- Now add the new constraint
ALTER TABLE registrations ADD CONSTRAINT check_programtype CHECK (programtype = 'regular');
