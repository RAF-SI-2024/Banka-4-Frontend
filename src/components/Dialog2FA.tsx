import { MaybePromise } from '@/types/MaybePromise';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useRef } from 'react';
import { Button } from './ui/button';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

export type Dialog2FAProps = {
  open: boolean;
  onSubmit: (otp: string) => MaybePromise<unknown>;
  onCancel?: () => MaybePromise<unknown>;
  errorMessage?: string;
};

export const Dialog2FA = ({
  open,
  onSubmit,
  onCancel,
  errorMessage,
}: Dialog2FAProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
            Input your OTP code here. Click submit when you are done.
          </DialogDescription>
        </DialogHeader>

        <InputOTP
          maxLength={6}
          ref={inputRef}
          inputMode="numeric"
          pattern={REGEXP_ONLY_DIGITS}
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
        {errorMessage && (
          <p className="-mt-2 text-red-500 dark:text-red-400 text-sm">
            {errorMessage}
          </p>
        )}
        <DialogFooter className="flex flex-col gap-2 sm:gap-0 sm:flex-row">
          <Button
            onClick={() => onSubmit(inputRef?.current?.value ?? '')}
            type="submit"
          >
            Submit
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
