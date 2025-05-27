
import { supabase, REGISTRATIONS_TABLE } from '../supabase/client';
import { Registration, SupabaseRegistration } from './types';
import { getAllRegistrations, addRegistration } from './operations';

// Export registrations to JSON
export const exportRegistrations = async (): Promise<string> => {
  try {
    const registrations = await getAllRegistrations();
    return JSON.stringify(registrations, null, 2);
  } catch (error) {
    console.error('Error exporting registrations:', error);
    throw new Error('Failed to export registrations');
  }
};

// Import registrations from JSON
export const importRegistrations = async (jsonData: string): Promise<void> => {
  try {
    const registrations: Registration[] = JSON.parse(jsonData);
    
    if (!Array.isArray(registrations)) {
      throw new Error('Invalid JSON format - expected an array of registrations');
    }

    // Import each registration
    for (const registration of registrations) {
      await addRegistration(registration);
    }
    
    console.log(`Successfully imported ${registrations.length} registrations`);
  } catch (error) {
    console.error('Error importing registrations:', error);
    throw new Error('Failed to import registrations');
  }
};
