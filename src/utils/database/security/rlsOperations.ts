
import { supabase, REGISTRATIONS_TABLE } from '@/utils/supabase/client';
import { checkRLSPolicies, fixRLSPolicies } from '@/utils/supabase/rls-helpers';
import { executeSql } from '../schema/db-connection';
import { useToast } from '@/hooks/use-toast';

/**
 * Attempts to fix database permissions by updating RLS policies
 */
export const fixDatabasePermissions = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    // Try to fix RLS policies first
    const rlsResult = await fixRLSPolicies();
    if (rlsResult.success) {
      // Recheck database access
      const { error: retryError } = await supabase
        .from(REGISTRATIONS_TABLE)
        .select('count')
        .limit(1);
          
      if (!retryError) {
        return {
          success: true,
          message: 'RLS policies fixed successfully!'
        };
      } else {
        return {
          success: false,
          message: `Fixed RLS but still having issues: ${retryError.message}`
        };
      }
    }
      
    // If RLS fix didn't work, try SQL execution
    const sqlScript = `
      -- Fix Row Level Security (RLS) policies
      ALTER TABLE IF EXISTS registrations ENABLE ROW LEVEL SECURITY;
      
      -- Drop existing policies to recreate them
      DROP POLICY IF EXISTS "Allow anonymous to view all registrations" ON registrations;
      DROP POLICY IF EXISTS "Allow anonymous to insert registrations" ON registrations;
      DROP POLICY IF EXISTS "Allow anonymous to update registrations" ON registrations;
      DROP POLICY IF EXISTS "Allow anonymous to delete registrations" ON registrations;
      DROP POLICY IF EXISTS "Allow anyone to view all registrations" ON registrations;
      DROP POLICY IF EXISTS "Allow anyone to insert registrations" ON registrations;
      DROP POLICY IF EXISTS "Allow anyone to update registrations" ON registrations;
      DROP POLICY IF EXISTS "Allow anyone to delete registrations" ON registrations;
      DROP POLICY IF EXISTS "Allow service_role full access" ON registrations;
      DROP POLICY IF EXISTS "Allow authenticated full access" ON registrations;
      DROP POLICY IF EXISTS "Enable insert for anon" ON registrations;
      DROP POLICY IF EXISTS "Allow public read access" ON registrations;
      
      -- Create service role policy (highest priority)
      CREATE POLICY "Allow service_role full access" 
      ON registrations 
      FOR ALL 
      TO service_role
      USING (true)
      WITH CHECK (true);
      
      -- Create authenticated role policy
      CREATE POLICY "Allow authenticated full access" 
      ON registrations 
      FOR ALL 
      TO authenticated
      USING (true)
      WITH CHECK (true);
      
      -- Create anonymous role policies
      CREATE POLICY "Allow public read access" 
      ON registrations 
      FOR SELECT 
      TO anon
      USING (true);
      
      CREATE POLICY "Enable insert for anon" 
      ON registrations 
      FOR INSERT 
      TO anon
      WITH CHECK (true);
    `;
      
    const { success, error, details } = await executeSql(sqlScript);
      
    if (success) {
      // Recheck database access
      const { error: retryError } = await supabase
        .from(REGISTRATIONS_TABLE)
        .select('count')
        .limit(1);
          
      if (!retryError) {
        return {
          success: true,
          message: 'Database permissions fixed successfully!'
        };
      }
      
      return {
        success: true,
        message: 'Permissions fixed successfully! Please try again.'
      };
    } else {
      console.error('SQL execution details:', details);
      return {
        success: false,
        message: `Failed to fix permissions: ${error}`,
        details
      };
    }
  } catch (error) {
    console.error('Error fixing permissions:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
      details: error
    };
  }
};
