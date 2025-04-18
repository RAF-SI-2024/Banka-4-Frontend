import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChangeLimitDialog } from '@/components/actuary/change-limit-dialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useHttpClient } from '@/context/HttpClientContext';
import { resetUsedLimit } from '@/api/actuaries';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { ActuaryItem } from '@/api/response/actuaries';
import { toastRequestError } from '@/api/errors';

export function ActuaryActions({ item }: { item: ActuaryItem }) {
  const [isChangeLimitDialogOpen, setChangeLimitDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const client = useHttpClient();

  const handleSubmit = () => {
    resetLimit(item.user.id);
  };

  const { mutate: resetLimit } = useMutation({
    mutationKey: ['actuaries'],
    mutationFn: async (actuaryId: string) => {
      await resetUsedLimit(client, actuaryId);
    },
    onSuccess: () => {
      toast.success('Used limit reset successfully');
      setConfirmDialogOpen(false);
    },
    onError: (error) => {
      toastRequestError(error);
    },
  });

  return (
    <div className="flex space-x-2">
      {item.actuary.limitAmount !== null && (
        <Button
          variant="outline"
          onClick={() => setChangeLimitDialogOpen(true)}
        >
          Change Limit
        </Button>
      )}
      <Button variant="outline" onClick={() => setConfirmDialogOpen(true)}>
        Reset Limit
      </Button>

      {isChangeLimitDialogOpen && (
        <ChangeLimitDialog
          item={item}
          open={isChangeLimitDialogOpen}
          onOpenChange={setChangeLimitDialogOpen}
        />
      )}

      {isConfirmDialogOpen && (
        <ConfirmDialog
          open={isConfirmDialogOpen}
          onConfirm={handleSubmit}
          onCancel={() => setConfirmDialogOpen(false)}
          title="Reset Limit"
          description="Are you sure you want to reset the used limit?"
        />
      )}
    </div>
  );
}
