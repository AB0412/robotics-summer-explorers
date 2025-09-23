
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminLoginProps {
  onLogin: () => void;
}

// Hard-coded admin password - in a real app, this would be handled securely
const ADMIN_PASSWORD = "Rock@987654321$";

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleAuthentication = async () => {
    if (password !== ADMIN_PASSWORD) {
      toast({
        title: "Authentication failed",
        description: "Incorrect password",
        variant: "destructive",
      });
      return;
    }

    try {
      // Sign in as admin user using Supabase
      const adminEmail = 'billorevinash12@gmail.com';
      
      // Try to sign in first
      let { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: ADMIN_PASSWORD,
      });

      // Handle specific error cases
      if (signInError) {
        if (signInError.message.includes('Email not confirmed')) {
          toast({
            title: "Email confirmation required",
            description: "Please check your email and click the confirmation link before logging in. Check billorevinash12@gmail.com inbox.",
            variant: "destructive",
          });
          return;
        }
        
        if (signInError.message.includes('Invalid login credentials')) {
          // User doesn't exist, create them
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: adminEmail,
            password: ADMIN_PASSWORD,
            options: {
              data: {
                full_name: 'Admin User',
                role: 'admin'
              },
              emailRedirectTo: `${window.location.origin}/admin`
            }
          });

          if (signUpError) {
            throw signUpError;
          }

          toast({
            title: "Admin account created",
            description: "Please check billorevinash12@gmail.com for a confirmation email, then return to login.",
            variant: "default",
          });
          return;
        }
        
        throw signInError;
      }

      // Ensure profile has admin role
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: adminEmail,
            full_name: 'Admin User',
            role: 'admin'
          });

        if (profileError) {
          console.warn('Profile update error:', profileError);
        }
      }

      sessionStorage.setItem('adminAuthenticated', 'true');
      onLogin();
      toast({
        title: "Authentication successful",
        description: "Welcome to the admin dashboard",
      });
    } catch (error) {
      console.error('Admin authentication error:', error);
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Authentication error",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAuthentication();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Authentication</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button onClick={handleAuthentication}>Login</Button>
        </div>
      </CardContent>
    </Card>
  );
};
