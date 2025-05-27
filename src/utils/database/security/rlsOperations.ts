import { supabase, REGISTRATIONS_TABLE } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { executeSQL } from '@/utils/database/schema/connection/execute-sql';

/**
 * Checks the existing Row Level Security (RLS) policies on the registrations table.
 * @returns {Promise<{ success: boolean; message: string; }>} - An object indicating the success status and a message.
 */
export const checkRLSPolicies = async (): Promise<{ success: boolean; message: string; }> => {
  try {
    // Fetch existing policies
    const { data: policies, error: policyError } = await supabase
      .from('supabase_policies')
      .select('*')
      .eq('table_name', REGISTRATIONS_TABLE);
    
    if (policyError) {
      console.error('Error fetching RLS policies:', policyError);
      return { success: false, message: `Failed to fetch RLS policies: ${policyError.message}` };
    }
    
    // Define expected policies
    const expectedPolicies = [
      { name: 'Allow service_role full access', roles: ['service_role'], command: 'ALL' },
      { name: 'Allow authenticated full access', roles: ['authenticated'], command: 'ALL' },
      { name: 'Enable insert for anon', roles: ['anon'], command: 'INSERT' },
      { name: 'Allow public read access', roles: ['anon'], command: 'SELECT' }
    ];
    
    // Check if each expected policy exists
    for (const expectedPolicy of expectedPolicies) {
      const policyExists = policies?.some(
        policy =>
          policy.name === expectedPolicy.name &&
          expectedPolicy.roles.every(role => policy.roles.includes(role)) &&
          policy.command === expectedPolicy.command
      );
      
      if (!policyExists) {
        return {
          success: false,
          message: `Missing or incorrect RLS policy: ${expectedPolicy.name}. Please run the SQL script to fix.`,
        };
      }
    }
    
    return { success: true, message: 'All essential RLS policies are correctly configured.' };
  } catch (error) {
    console.error('Error checking RLS policies:', error);
    return { success: false, message: `Error checking RLS policies: ${error}` };
  }
};

/**
 * Fixes Row Level Security (RLS) policies on the registrations table by executing a SQL script.
 * @returns {Promise<{ success: boolean; message: string; }>} - An object indicating the success status and a message.
 */
export const fixRLSPolicies = async (): Promise<{ success: boolean; message: string; }> => {
  try {
    const sqlScript = `
      -- Drop existing policies
      DROP POLICY IF EXISTS "Allow service_role full access" ON registrations;
      DROP POLICY IF EXISTS "Allow authenticated full access" ON registrations;
      DROP POLICY IF EXISTS "Enable insert for anon" ON registrations;
      DROP POLICY IF EXISTS "Allow public read access" ON registrations;
      
      -- Create policies
      CREATE POLICY "Allow service_role full access" ON registrations
        FOR ALL 
        TO service_role
        USING (true)
        WITH CHECK (true);
      
      CREATE POLICY "Allow authenticated full access" ON registrations
        FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true);
      
      CREATE POLICY "Enable insert for anon" ON registrations 
        FOR INSERT 
        TO anon
        WITH CHECK (true);
      
      CREATE POLICY "Allow public read access" ON registrations 
        FOR SELECT
        TO anon
        USING (true);
        
      -- Reset ownership and grants
      ALTER TABLE registrations OWNER TO authenticated;
      GRANT ALL ON registrations TO service_role;
      GRANT ALL ON registrations TO authenticated;
      GRANT SELECT, INSERT ON registrations TO anon;
      GRANT USAGE, SELECT ON SEQUENCE registrations_id_seq TO authenticated;
      GRANT USAGE, SELECT ON SEQUENCE registrations_id_seq TO service_role;

      -- Make sure RLS is turned OFF when using service_role
      ALTER TABLE registrations FORCE ROW LEVEL SECURITY;
    `;
    
    // Execute each SQL statement separately
    const statements = sqlScript.split(';').map(stmt => stmt.trim()).filter(stmt => stmt);
    
    for (const stmt of statements) {
      if (!stmt) continue;
      
      const { data, error } = await executeSQL(stmt + ';');
      
      if (error) {
        console.error('SQL execution error:', error);
        return { success: false, message: `SQL execution failed: ${error.message}` };
      }
    }
    
    return { success: true, message: 'RLS policies have been successfully reset and configured.' };
  } catch (error) {
    console.error('Error fixing RLS policies:', error);
    return { success: false, message: `Error fixing RLS policies: ${error}` };
  }
};
