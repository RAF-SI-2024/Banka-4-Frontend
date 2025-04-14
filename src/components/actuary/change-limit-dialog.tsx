'use clinet';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ActuaryItem } from '@/types/actuary';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import { updateLimits } from '@/api/actuaries';
import { useMutation } from '@tanstack/react-query';
import { useHttpClient } from '@/context/HttpClientContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';

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
  const [newLimit, setNewLimit] = useState<number>(item.actuary.limitAmount);

  const client = useHttpClient();

  const { mutate: doLimitUpdate } = useMutation({
    mutationKey: ['actuary'],
    mutationFn: async ({
      actuaryId,
      newLimit,
    }: {
      actuaryId: string;
      newLimit: number;
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
        <div className={'flex gap-6'}>
          <div className="flex flex-col">
            <Label>Limit:</Label>
            <Input
              type="text"
              className={'disabled:cursor-default'}
              value={newLimit}
              onChange={(e) => setNewLimit(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveChanges}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
