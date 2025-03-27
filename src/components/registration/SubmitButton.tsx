import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
  hasValidCredentials: boolean;
  databaseReady: boolean | null;
}

const SubmitButton = ({ isSubmitting, hasValidCredentials, databaseReady }: SubmitButtonProps) => {
  // Calculate the disabled state carefully to avoid flickering
  const isDisabled = React.useMemo(() => {
    // Always disabled if submitting
    if (isSubmitting) return true;
    
    // Disabled if no credentials
    if (!hasValidCredentials) return true;
    
    // If database state is known and not ready, disable
    if (databaseReady === false) return true;
    
    // Otherwise enable the button
    return false;
  }, [isSubmitting, hasValidCredentials, databaseReady]);

  return (
    <Button 
      type="submit" 
      className="w-full bg-robotics-accent hover:bg-robotics-lightblue text-robotics-navy flex items-center justify-center gap-2"
      disabled={isDisabled}
    >
      <Send className="h-4 w-4" />
      {isSubmitting ? 'Submitting...' : 'Submit Registration'}
    </Button>
  );
};

export default SubmitButton;
