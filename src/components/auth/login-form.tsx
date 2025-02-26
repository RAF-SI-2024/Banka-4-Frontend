'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
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
import ForgotPasswordDialog from '@/components/auth/forgot-password-dialog';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
});

export type LoginFormData = z.infer<typeof formSchema>;

export interface LoginFormProps {
  onSubmitAction: (values: LoginFormData) => void;
}

export default function LoginForm({ onSubmitAction }: LoginFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <Card className="w-[348px] shadow-md">
      <CardHeader className="space-y-2">
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Securely access your account and manage your finances with ease.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitAction)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="example@domain.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="**********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                  <ForgotPasswordDialog />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" variant="default" className="font-normal">
                Login
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
