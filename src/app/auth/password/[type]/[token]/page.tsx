'use client';

import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notFound, useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { VerifyPasswordRequest } from '@/api/request/auth';
import { toastRequestError } from '@/api/errors';
import { useHttpClient } from '@/context/HttpClientContext';
import { verifyPassword } from '@/api/auth';

// Zod schema for password validation
const passwordSchema = z
  .object({
    password: z.string().min(8).max(32),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordParams = {
  type: string;
  token: string;
};

export default function PasswordPage() {
  const params = useParams<PasswordParams>();
  const client = useHttpClient();
  const router = useRouter();

  if (params.type !== 'set' && params.type !== 'reset') notFound();

  const isReset = params.type === 'reset';

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { isPending, mutate: doVerify } = useMutation({
    mutationFn: async (data: VerifyPasswordRequest) =>
      verifyPassword(client, data),
    onSuccess: () => {
      toast.success(
        isReset ? 'Password reset successfully!' : 'Password set successfully!'
      );
      router.replace('/auth/login');
    },
    onError: (error) => {
      toastRequestError(error);
    },
  });

  return (
    <div className="flex justify-center items-center pt-16">
      <Card className="w-full max-w-[348px] rounded-lg border p-4">
        <CardHeader className="w-full p-4 text-left">
          <h2 className="text-2xl font-semibold">
            {isReset ? 'Reset Your Password' : 'Set Your Password'}
          </h2>
          <p className="text-sm text-muted-foreground mt-3">
            {isReset
              ? 'Forgot your password? No worries — set a new one to regain secure access to your account.'
              : 'Create a strong, secure password to protect your account and keep your information safe.'}
          </p>
        </CardHeader>

        <CardContent className="px-4 pb-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) =>
                doVerify({
                  verificationCode: params.token,
                  password: values.password,
                })
              )}
              className="space-y-4"
            >
              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="**************"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="**************"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end mt-2">
                <Button
                  type="submit"
                  className="rounded-md py-1 px-2 text-sm font-medium flex items-center gap-2"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader className="w-4 h-4 animate-spin" /> // 🔥
                  ) : isReset ? (
                    'Reset Password'
                  ) : (
                    'Confirm'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
