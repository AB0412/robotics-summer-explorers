
import { toast } from '@/hooks/use-toast';
import { validateDatabaseSchema } from './validation';
import { addMissingColumns } from './column-management';
import { generateSchemaUpdateSQL } from './sql-generator';

// Update initialization in the client.ts file to include our new validation
export const enhancedInitializeDatabase = async (): Promise<void> => {
  try {
    console.log('Enhanced database initialization...');
    const isSchemaValid = await validateDatabaseSchema();
    
    if (!isSchemaValid) {
      console.log('Schema validation failed, attempting to add missing columns...');
      const columnsAdded = await addMissingColumns();
      
      if (columnsAdded) {
        // Validate schema again after adding columns
        const revalidated = await validateDatabaseSchema();
        if (revalidated) {
          console.log('Schema successfully updated and validated');
          toast({
            title: "Database Schema Updated",
            description: "Missing columns were added to the database schema.",
          });
        } else {
          console.error('Schema still invalid after adding columns');
          const sqlScript = await generateSchemaUpdateSQL();
          console.log('Generated SQL script:', sqlScript);
          
          toast({
            title: "Schema Update Required",
            description: "Please run the SQL script provided in the admin dashboard to update your database.",
            variant: "destructive",
          });
        }
      } else {
        console.error('Failed to add missing columns');
        const sqlScript = await generateSchemaUpdateSQL();
        console.log('Generated SQL script:', sqlScript);
        
        toast({
          title: "Schema Update Required",
          description: "Please run the SQL script provided in the admin dashboard to update your database schema.",
          variant: "destructive",
        });
      }
    }
  } catch (error) {
    console.error('Error in enhanced database initialization:', error);
  }
};

// Create a view or div element to display the SQL script
export const createSQLScriptElement = async (): Promise<HTMLElement> => {
  const sqlScript = await generateSchemaUpdateSQL();
  
  const container = document.createElement('div');
  container.className = 'bg-slate-800 text-white p-4 rounded-md mt-4 overflow-x-auto';
  
  const header = document.createElement('div');
  header.className = 'font-bold text-sm mb-2';
  header.textContent = 'SQL Script to Update Schema:';
  
  const pre = document.createElement('pre');
  pre.className = 'text-xs';
  pre.textContent = sqlScript;
  
  container.appendChild(header);
  container.appendChild(pre);
  
  return container;
};
