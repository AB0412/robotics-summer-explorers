
// Re-export from the refactored modules for backward compatibility
export * from './schema/validation';
export * from './schema/ui-helpers';
export * from './schema/sql-generator';
export * from './schema/db-connection';
export * from './schema/index';

// Re-export commonly used functions directly for convenience 
import { checkDatabaseConnection, executeSql } from './schema/db-connection';
import { validateDatabaseSchema, enhancedInitializeDatabase } from './schema/validation';

export { 
  checkDatabaseConnection, 
  executeSql,
  validateDatabaseSchema, 
  enhancedInitializeDatabase 
};
