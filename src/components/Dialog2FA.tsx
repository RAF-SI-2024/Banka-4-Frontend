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
};

export const Dialog2FA = ({ open, onSubmit, onCancel }: Dialog2FAProps) => {
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
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <DialogFooter>
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
