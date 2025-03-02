import { MaybePromise } from '@/types/MaybePromise';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export type Dialog2FAProps = {
  open: boolean;
  onSubmit: (otp: string) => MaybePromise<unknown>;
  onCancel?: () => MaybePromise<unknown>;
  errorMessage?: string;
};

const twoFactorSchema = z.object({
  otp: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});

type TwoFactorFormData = z.infer<typeof twoFactorSchema>;

export const Dialog2FA = ({
  open,
  onSubmit,
  onCancel,
  errorMessage,
}: Dialog2FAProps) => {
  const form = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      otp: '',
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={async (newOpen) => {
        if (!newOpen) await onCancel?.();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OTP Code Input</DialogTitle>
          <DialogDescription>
            Input your OTP code here. Click confirm when you are done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async ({ otp }) => {
              await onSubmit?.(otp);
            })}
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div>
                      <InputOTP
                        maxLength={6}
                        inputMode="numeric"
                        pattern={REGEXP_ONLY_DIGITS}
                        {...field}
                      >
                        <InputOTPGroup>
                          {[...new Array(6)].map((_, idx) => (
                            <InputOTPSlot
                              key={idx}
                              index={idx}
                              className={`${errorMessage != null ? 'border-red-500 dark:border-red-400' : ''}`}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>

                      <FormMessage className="text-red-500 dark:text-red-400 text-sm">
                        {errorMessage}
                      </FormMessage>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-col-reverse gap-2 sm:flex-row-reverse">
              <Button type="submit">Confirm</Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
