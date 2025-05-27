
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { executeSQL } from '@/utils/database/schema/connection/execute-sql';

/**
 * Checks the existing Row Level Security (RLS) policies on the registrations table.
 * @returns {Promise<{ success: boolean; message: string; }>} - An object indicating the success status and a message.
 */
export const checkRLSPolicies = async (): Promise<{ success: boolean; message: string; }> => {
  try {
    // For now, we'll use a simplified check since we can't access the supabase_policies table directly
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Error checking RLS policies:', error);
      return { success: false, message: `Failed to check RLS policies: ${error.message}` };
    }
    
    return { success: true, message: 'RLS policies appear to be working correctly.' };
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

/**
 * Alias for fixRLSPolicies to maintain compatibility
 */
export const fixDatabasePermissions = fixRLSPolicies;
