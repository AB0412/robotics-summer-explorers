
// This file contains utility functions for UI components related to schema operations

// Function to get database error message for UI display
export const getSchemaErrorMessage = (error: any): string => {
  if (!error) return 'Unknown database error';
  
  if (typeof error === 'string') return error;
  
  if (error.code) {
    switch (error.code) {
      case '42P01':
        return 'Table does not exist';
      case '42703':
        return 'Column does not exist';
      case '23505':
        return 'Duplicate key value violates unique constraint';
      default:
        return `Database error: ${error.message || error.code}`;
    }
  }
  
  return error.message || 'Unknown database error';
};

// Function to generate a user-friendly column type name
export const getFriendlyColumnType = (pgType: string): string => {
  const typeMap: Record<string, string> = {
    'text': 'Text',
    'integer': 'Number',
    'bigint': 'Number',
    'boolean': 'Yes/No',
    'timestamp': 'Date & Time',
    'date': 'Date',
    'jsonb': 'JSON',
    'uuid': 'Unique ID',
  };
  
  return typeMap[pgType.toLowerCase()] || pgType;
};
