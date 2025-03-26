
// Re-export all the database functionality from the module files
export * from './types';
export * from '../supabase/client';
export * from './registrations';
export * from './search';
export * from './import-export';

// Initialize the database when this module loads
import { initializeDatabase } from '../supabase/client';

initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
});
