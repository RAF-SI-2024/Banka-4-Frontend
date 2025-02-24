'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// Zod password validation
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password must be at most 32 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function SetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = () => {
    alert('Password set successfully!');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-[348px] max-h-[348px] bg-white rounded-lg border border-zinc-200 p-3">
        <CardHeader className="w-full h-[100px] p-3 text-left">
          <h2 className="text-2xl font-semibold text-[#09090B] font-inter">
            Set Password
          </h2>
          <p className="text-sm text-[#71717A] mt-3 font-inter">
            Create a strong, secure password to protect your account and keep
            your information safe.
          </p>
        </CardHeader>

        <CardContent className="px-3 pb-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                {...register('password')}
                className="mt-1 text-sm"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-sm">
                Confirm password
              </Label>
              <Input
                type="password"
                id="confirmPassword"
                {...register('confirmPassword')}
                className="mt-1 text-sm"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="flex justify-end mt-2">
              <Button
                type="submit"
                className="bg-[#18181B] text-white rounded-md py-1 px-2 w-[80px] h-[40px] text-sm font-medium"
              >
                Confirm
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
