'use client';
import { toastRequestError } from '@/api/errors';
import LoginForm, { LoginFormData } from '@/components/auth/login-form';
import { useAuth } from '@/context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();

  const { isPending, mutate: doLogin } = useMutation({
    mutationFn: async ({ email, password }: LoginFormData) => {
      if (!auth.isLoggedIn) await auth.login('employee', email, password);
    },
    onError: (err) => toastRequestError(err),
  });

  useEffect(() => {
    if (auth.isLoggedIn) return router.replace('/');
  }, [router, auth]);

  return (
    <div className="flex justify-center items-center pt-16">
      <LoginForm enabled={!isPending} onSubmitAction={doLogin} />
    </div>
  );
}
