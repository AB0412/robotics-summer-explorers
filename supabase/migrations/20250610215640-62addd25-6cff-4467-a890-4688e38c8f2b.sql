
-- Add programtype column to the registrations table
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS programtype TEXT NOT NULL DEFAULT 'summer-camp';

-- Add a check constraint to ensure only valid values are allowed
ALTER TABLE registrations ADD CONSTRAINT check_programtype CHECK (programtype IN ('summer-camp', 'school-year'));
