'use client';
import { toastRequestError } from '@/api/errors';
import LoginForm, { LoginFormData } from '@/components/auth/login-form';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
      toastRequestError(err);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <LoginForm onSubmitAction={handleLogin} />
    </div>
  );
}
