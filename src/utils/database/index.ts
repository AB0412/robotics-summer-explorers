
// Re-export all the database functionality from the module files
export * from './types';
export * from '../supabase/client';
export * from './core';
export * from './search';
export * from './import-export';
export * from './schema-utils';

// Re-export the EnhancedRegistration type from RegistrationsTable
export type { EnhancedRegistration } from '@/components/admin/RegistrationsTable';

// Import and re-export operations separately to avoid conflicts
import { getAllRegistrations, addRegistration as addReg, deleteRegistration as deleteReg } from './operations';
export { getAllRegistrations, addReg as addRegistration, deleteReg as deleteRegistration };

// Initialize the database when this module loads
import { initializeDatabase } from '../supabase/client';

// Use a try/catch to prevent initialization errors from crashing the app
try {
  initializeDatabase().catch(error => {
    console.error('Failed to initialize database:', error);
  });
} catch (error) {
  console.error('Error during database initialization:', error);
}
