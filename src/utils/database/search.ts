
import { supabase, REGISTRATIONS_TABLE } from '@/integrations/supabase/client';
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
    
    if (field === 'all') {
      // For 'all' we need to make multiple queries and combine results
      const [nameResults, emailResults, idResults, childNameResults] = await Promise.all([
        supabase.from(REGISTRATIONS_TABLE).select('*').ilike('parentName', `%${term}%`),
        supabase.from(REGISTRATIONS_TABLE).select('*').ilike('parentEmail', `%${term}%`),
        supabase.from(REGISTRATIONS_TABLE).select('*').ilike('registrationId', `%${term}%`),
        supabase.from(REGISTRATIONS_TABLE).select('*').ilike('childName', `%${term}%`)
      ]);
      
      // Combine results, removing duplicates
      const combinedResults = [
        ...(nameResults.data || []),
        ...(emailResults.data || []),
        ...(idResults.data || []),
        ...(childNameResults.data || [])
      ];
      
      // Remove duplicates by registrationId
      const uniqueResults = Array.from(
        new Map(combinedResults.map(item => [item.registrationId, item])).values()
      );
      
      return uniqueResults as Registration[];
    } else {
      // For specific fields, we can do a single query
      const { data, error } = await supabase
        .from(REGISTRATIONS_TABLE)
        .select('*')
        .ilike(field, `%${term}%`);
      
      if (error) {
        console.error(`Error searching registrations by ${field}:`, error);
        return [];
      }
      
      return data as Registration[];
    }
  } catch (error) {
    console.error('Error searching registrations:', error);
    return [];
  }
};
