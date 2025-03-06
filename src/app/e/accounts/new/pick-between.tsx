import React from 'react';
import { Button } from '@/components/ui/button';

interface PickBetweenProps {
  title: string;
  firstOptionText: string;
  secondOptionText: string;
  firstOptionIcon: React.ElementType;
  secondOptionIcon: React.ElementType;
  onFirstOptionSelected: () => void;
  onSecondOptionSelected: () => void;
}

export default function PickBetween(props: PickBetweenProps) {
  return (
    <div>
      <h1 className={'pt-12 text-2xl text-center'}>{props.title}</h1>
      <div className={'flex items-center justify-center mt-10 gap-8'}>
        <Button
          variant={'outline'}
          className={'size-96 text-2xl flex flex-col shadow-md'}
          onClick={props.onFirstOptionSelected}
        >
          <props.firstOptionIcon className={'!size-24 text-muted-foreground'} />
          <span>{props.firstOptionText}</span>
        </Button>
        <div
          className={
            'bg-foreground select-none p-4 aspect-square text-background size-12 rounded-full flex items-center justify-center'
          }
        >
          or
        </div>
        <Button
          variant={'outline'}
          className={'size-96 text-2xl flex flex-col shadow-md'}
          onClick={props.onSecondOptionSelected}
        >
          <props.secondOptionIcon
            className={'!size-24 text-muted-foreground'}
          />
          <span>{props.secondOptionText}</span>
        </Button>
      </div>
    </div>
  );
}
