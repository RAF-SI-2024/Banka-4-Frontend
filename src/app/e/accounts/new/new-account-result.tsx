'use client';

import { Check, LoaderCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactConfetti from 'react-confetti';

/**
 * undefined indicates that the request is pending
 */
interface ResultProps {
  isSuccess?: boolean;
  onTryAgainAction: () => void;
}

export default function NewAccountResult(props: ResultProps) {
  return (
    <>
      <div className={'size-10'}></div>
      <div className={'w-full flex items-center justify-center h-full'}>
        {props.isSuccess === undefined ? (
          <LoaderCircle className={'animate-spin'} />
        ) : props.isSuccess ? (
          <>
            <SuccessIndicator />
          </>
        ) : (
          <ErrorIndicator onTryAgainAction={props.onTryAgainAction} />
        )}
      </div>
    </>
  );
}

function ErrorIndicator({
  onTryAgainAction,
}: {
  onTryAgainAction: () => void;
}) {
  return (
    <div className={'flex flex-col justify-center items-center gap-6'}>
      <div
        className={
          'size-32 bg-destructive text-white flex justify-center items-center rounded-full'
        }
      >
        <X className={'!size-24'} />
      </div>
      <div className={'flex flex-col items-center gap-2 text-2xl'}>
        Unfortunately there was an error while processing your request.
        <Button variant={'secondary'} onClick={onTryAgainAction}>
          Try again
        </Button>
      </div>
    </div>
  );
}

function SuccessIndicator() {
  return (
    <div className={'flex flex-col justify-center items-center gap-6'}>
      <div
        className={
          'size-32 bg-emerald-600 text-white flex justify-center items-center rounded-full'
        }
      >
        <ReactConfetti className="max-w-full" initialVelocityY={30} />
        <Check className={'!size-24'} />
      </div>
      <div className={'text-2xl'}>
        Account was successfully created. Congrats!
      </div>
    </div>
  );
}
