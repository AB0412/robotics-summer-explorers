import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type Status = 'validating' | 'valid' | 'invalid' | 'already' | 'submitting' | 'success' | 'error';

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState<Status>('validating');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      setErrorMessage('Missing unsubscribe token in the link.');
      return;
    }

    const validate = async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } }
        );
        const data = await res.json();
        if (data.valid) {
          setStatus('valid');
        } else if (data.reason === 'already_unsubscribed') {
          setStatus('already');
        } else {
          setStatus('invalid');
          setErrorMessage(data.error || 'This unsubscribe link is invalid or expired.');
        }
      } catch (err) {
        setStatus('invalid');
        setErrorMessage('Could not validate the unsubscribe link. Please try again.');
      }
    };
    validate();
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setStatus('submitting');
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success || data.reason === 'already_unsubscribed') {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Could not process unsubscribe.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Email Preferences</h1>

        {status === 'validating' && (
          <div className="flex flex-col items-center gap-3 py-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Validating your link…</p>
          </div>
        )}

        {status === 'valid' && (
          <>
            <p className="text-muted-foreground mb-6">
              Click below to confirm you'd like to unsubscribe from emails.
            </p>
            <Button onClick={handleConfirm} variant="destructive" className="w-full">
              Confirm Unsubscribe
            </Button>
          </>
        )}

        {status === 'submitting' && (
          <div className="flex flex-col items-center gap-3 py-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Processing…</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <p className="font-medium">You've been unsubscribed.</p>
            <p className="text-sm text-muted-foreground">You will no longer receive these emails.</p>
          </div>
        )}

        {status === 'already' && (
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <p className="font-medium">You're already unsubscribed.</p>
          </div>
        )}

        {(status === 'invalid' || status === 'error') && (
          <div className="flex flex-col items-center gap-3 py-4">
            <XCircle className="h-12 w-12 text-destructive" />
            <p className="font-medium">Something went wrong</p>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
          </div>
        )}
      </Card>
    </main>
  );
};

export default Unsubscribe;
