import { supabase, REGISTRATIONS_TABLE } from '../supabase/client';
import { Registration } from './types';

// Search registrations by field and term
export const searchRegistrations = async (
  field: 'all' | 'parentName' | 'childName' | 'parentEmail' | 'registrationId',
  term: string
): Promise<Registration[]> => {
  try {
    if (!term.trim()) {
      // Import the function dynamically to avoid circular dependencies
      const { getAllRegistrations } = await import('./registrations');
      return getAllRegistrations();
    }
    
    // Map camelCase field names to snake_case database columns
    const fieldMap: Record<string, string> = {
      parentName: 'parentname',
      childName: 'childname',
      parentEmail: 'parentemail',
      registrationId: 'registrationid'
    };
    
    if (field === 'all') {
      // For 'all' we need to make multiple queries and combine results
      const [nameResults, emailResults, idResults, childNameResults] = await Promise.all([
        supabase.from(REGISTRATIONS_TABLE).select('*').ilike('parentname', `%${term}%`),
        supabase.from(REGISTRATIONS_TABLE).select('*').ilike('parentemail', `%${term}%`),
        supabase.from(REGISTRATIONS_TABLE).select('*').ilike('registrationid', `%${term}%`),
        supabase.from(REGISTRATIONS_TABLE).select('*').ilike('childname', `%${term}%`)
      ]);
      
      // Combine results, removing duplicates
      const combinedResults = [
        ...(nameResults.data || []),
        ...(emailResults.data || []),
        ...(idResults.data || []),
        ...(childNameResults.data || [])
      ];
      
      // Remove duplicates by registrationid
      const uniqueResults = Array.from(
        new Map(combinedResults.map(item => [item.registrationid, item])).values()
      );
      
      return uniqueResults as unknown as Registration[];
    } else {
      // For specific fields, we can do a single query
      const dbField = fieldMap[field] || field.toLowerCase();
      const { data, error } = await supabase
        .from(REGISTRATIONS_TABLE)
        .select('*')
        .ilike(dbField, `%${term}%`);
      
      if (error) {
        console.error(`Error searching registrations by ${field}:`, error);
        return [];
      }
      
      return data as unknown as Registration[];
    }
  } catch (error) {
    console.error('Error searching registrations:', error);
    return [];
  }
};
