
// Re-export from the refactored modules for backward compatibility
export * from './schema/validation';
export * from './schema/ui-helpers';
export * from './schema/column-management';
export * from './schema/db-connection';
export * from './schema/index';

// Re-export commonly used functions directly for convenience 
import { checkDatabaseConnection } from './schema/connection/check-connection';
import { executeSQL } from './schema/connection/execute-sql';
import { validateDatabaseSchema } from './schema/validation';

export { 
  checkDatabaseConnection, 
  executeSQL as executeSql,
  executeSQL,
  validateDatabaseSchema
};
