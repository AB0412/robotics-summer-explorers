
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';
import { generateSchemaUpdateSQL } from '@/utils/database/schema-utils';
import { useToast } from '@/hooks/use-toast';

interface SchemaUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SchemaUpdateModal: React.FC<SchemaUpdateModalProps> = ({ open, onOpenChange }) => {
  const [sqlScript, setSqlScript] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadSqlScript();
    }
  }, [open]);

  const loadSqlScript = async () => {
    setLoading(true);
    try {
      const sql = await generateSchemaUpdateSQL();
      console.log("Generated SQL script:", sql); // Debug log to see what's returned
      
      if (!sql || sql.trim() === '' || sql.includes('No schema updates needed')) {
        setSqlScript('-- No schema updates needed or unable to generate SQL script');
      } else {
        setSqlScript(sql);
      }
    } catch (error) {
      console.error('Error generating SQL script:', error);
      setSqlScript('-- Error generating SQL script: ' + (error instanceof Error ? error.message : String(error)));
      toast({
        title: 'Error',
        description: 'Failed to generate SQL script',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript).then(() => {
      toast({
        title: 'SQL Copied',
        description: 'SQL script copied to clipboard',
      });
    }).catch(() => {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy SQL script',
        variant: 'destructive',
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Schema Update Required
          </DialogTitle>
          <DialogDescription>
            Run the following SQL in the Supabase SQL Editor to update your database schema.
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="bg-slate-800 text-white p-4 rounded-md mt-4 overflow-x-auto max-h-[300px]">
            <pre className="text-xs whitespace-pre-wrap">{sqlScript || '-- No SQL updates required'}</pre>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCopyToClipboard} disabled={!sqlScript || sqlScript.startsWith('-- No')}>
            Copy SQL to Clipboard
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
