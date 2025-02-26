'use client';
import LoginForm, { LoginFormData } from '@/components/auth/login-form';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  useEffect(() => {
    if (auth.isLoggedIn) return router.replace('/');
  }, [router, auth]);

  async function handleLogin({ email, password }: LoginFormData) {
    if (auth.isLoggedIn) return;
    try {
      await auth.login('employee', email, password);
    } catch (err) {
      // TODO(arsen): error handlin'
      toast('Login failed!');
      console.log(err);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <LoginForm onSubmitAction={handleLogin} />
    </div>
  );
}
