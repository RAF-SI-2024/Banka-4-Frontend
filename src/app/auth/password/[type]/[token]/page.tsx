'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { notFound, useParams } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Zod password validation
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
  const params = useParams() as PasswordParams;
  if (params.type !== 'set' && params.type !== 'reset') notFound();

  const isReset = params.type === 'reset';

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: z.infer<typeof passwordSchema>) => {
    alert(
        isReset ? 'Password reset successfully!' : 'Password set successfully!'
    );
    console.log(values);
  };

  return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-[348px] bg-white rounded-lg border border-zinc-200 p-4">
          <CardHeader className="w-full p-4 text-left">
            <h2 className="text-2xl font-semibold text-zinc-950">
              {isReset ? 'Reset Your Password' : 'Set Your Password'}
            </h2>
            <p className="text-sm text-zinc-500 mt-3">
              {isReset
                  ? 'Forgot your password? No worries — set a new one to regain secure access to your account.'
                  : 'Create a strong, secure password to protect your account and keep your information safe.'}
            </p>
          </CardHeader>

          <CardContent className="px-4 pb-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      className="bg-zinc-900 text-white rounded-md py-1 px-2 text-sm font-medium"
                  >
                    {isReset ? 'Reset Password' : 'Confirm'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
  );
}
