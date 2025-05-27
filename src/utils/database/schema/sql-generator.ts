import { supabase, REGISTRATIONS_TABLE } from '@/integrations/supabase/client';

// Function to generate SQL for creating the registrations table
export const generateCreateTableSQL = (): string => {
  return `
    CREATE TABLE IF NOT EXISTS ${REGISTRATIONS_TABLE} (
      id SERIAL PRIMARY KEY,
      registrationId VARCHAR(255) UNIQUE NOT NULL,
      parentName VARCHAR(255) NOT NULL,
      parentEmail VARCHAR(255) NOT NULL,
      parentPhone VARCHAR(20) NOT NULL,
      emergencyContact VARCHAR(255) NOT NULL,
      childName VARCHAR(255) NOT NULL,
      childAge VARCHAR(3) NOT NULL,
      childGrade VARCHAR(3) NOT NULL,
      schoolName VARCHAR(255) NOT NULL,
      medicalInfo TEXT,
      preferredBatch VARCHAR(255) NOT NULL,
      alternateBatch VARCHAR(255),
      hasPriorExperience VARCHAR(10) NOT NULL,
      experienceDescription TEXT,
      interestLevel VARCHAR(255),
      referralSource VARCHAR(255) NOT NULL,
      photoConsent BOOLEAN NOT NULL DEFAULT FALSE,
      waiverAgreement BOOLEAN NOT NULL DEFAULT FALSE,
      tShirtSize VARCHAR(10),
      specialRequests TEXT,
      volunteerInterest BOOLEAN NOT NULL DEFAULT FALSE,
      submittedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
};

// Function to generate SQL for adding a column
export const generateAddColumnSQL = (columnName: string, dataType: string): string => {
  return `ALTER TABLE ${REGISTRATIONS_TABLE} ADD COLUMN IF NOT EXISTS ${columnName} ${dataType};`;
};

// Function to generate SQL for dropping a column
export const generateDropColumnSQL = (columnName: string): string => {
  return `ALTER TABLE ${REGISTRATIONS_TABLE} DROP COLUMN IF EXISTS ${columnName};`;
};

// Function to execute raw SQL
export const executeSQL = async (sql: string): Promise<{ data: any; error: any }> => {
  const { data, error } = await supabase.rpc('execute_sql', { sql });
  
  if (error) {
    console.error('Error executing SQL:', error);
  } else {
    console.log('SQL executed successfully:', data);
  }
  
  return { data, error };
};
