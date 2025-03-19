'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useHttpClient } from '@/context/HttpClientContext';
import { useMutation } from '@tanstack/react-query';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { forgotPassword } from '@/api/auth';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordDialog() {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const httpClient = useHttpClient();
  const { isPending, mutate: doForgotPassword } = useMutation({
    mutationFn: async (email: string) =>
      await forgotPassword(httpClient, email),
    onSuccess: () => {
      toast('Reset password email sent.');
    },
  });

  const onSubmit = (data: ForgotPasswordValues) => {
    doForgotPassword(data.email);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-sm text-right w-full text-muted-foreground mt-1 cursor-pointer underline">
          forgot your password?
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-sm p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Forgot your password?
          </DialogTitle>
          <DialogDescription className="text-sm">
            Enter your email address, and we’ll send you a link to reset your
            password.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className={'flex flex-col gap-4'}
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
              e.preventDefault();
            }}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="john@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Sending...' : 'Send Email'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
