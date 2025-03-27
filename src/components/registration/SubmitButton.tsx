
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
  hasValidCredentials: boolean;
  databaseReady: boolean | null;
}

const SubmitButton = ({ isSubmitting, hasValidCredentials, databaseReady }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-robotics-accent hover:bg-robotics-lightblue text-robotics-navy flex items-center justify-center gap-2"
      disabled={isSubmitting || !hasValidCredentials || databaseReady === false}
    >
      <Send className="h-4 w-4" />
      {isSubmitting ? 'Submitting...' : 'Submit Registration'}
    </Button>
  );
};

export default SubmitButton;
