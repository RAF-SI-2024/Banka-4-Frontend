'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
  enabled?: boolean;
  onSubmitAction: (values: LoginFormData) => void;
}

export default function LoginForm({
  onSubmitAction,
  enabled = true,
}: LoginFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitAction)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
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
              <FormLabel>Password</FormLabel>
              <div className={'w-full text-end'}>
                <FormControl>
                  <Input type="password" placeholder="**********" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
                <ForgotPasswordDialog />
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="default"
            className="font-normal"
            disabled={!enabled}
          >
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
}
