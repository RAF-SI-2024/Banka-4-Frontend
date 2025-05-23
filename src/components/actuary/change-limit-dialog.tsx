'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import { updateLimits } from '@/api/actuaries';
import { useMutation } from '@tanstack/react-query';
import { useHttpClient } from '@/context/HttpClientContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { ActuaryItem } from '@/api/response/actuaries';
import { toastRequestError } from '@/api/errors';

interface ChangeLimitDialogProps {
  item: ActuaryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeLimitDialog({
  item,
  open,
  onOpenChange,
}: ChangeLimitDialogProps) {
  const [newLimit, setNewLimit] = useState<number | null>(
    item.actuary.limitAmount
  );

  const client = useHttpClient();

  const { mutate: doLimitUpdate } = useMutation({
    mutationKey: ['actuaries'],
    mutationFn: async ({
      actuaryId,
      newLimit,
    }: {
      actuaryId: string;
      newLimit: number | null;
    }) => updateLimits(client, actuaryId, newLimit),
    onSuccess: () => {
      toast.success('Limit changed successfully');
    },
  });

  const handleSaveChanges = () => {
    doLimitUpdate({ actuaryId: item.user.id, newLimit });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={'!max-w-md mx-auto'}>
        <DialogHeader>
          <DialogTitle className={'text-2xl'}>Change Limit</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveChanges();
          }}
        >
          <div className={'flex gap-6'}>
            <div className="flex flex-col">
              <Label>Limit:</Label>
              <Input
                type="text"
                className={'disabled:cursor-default'}
                value={newLimit !== null ? newLimit : ''}
                onChange={(e) => setNewLimit(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
