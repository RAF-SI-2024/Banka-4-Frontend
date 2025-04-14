import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChangeLimitDialog } from '@/components/actuary/change-limit-dialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useHttpClient } from '@/context/HttpClientContext';
import { resetUsedLimit } from '@/api/actuaries';
import { toast } from 'sonner';
import { ActuaryItem } from '@/types/actuary';

export function ActuaryActions({ item }: { item: ActuaryItem }) {
  const [isChangeLimitDialogOpen, setChangeLimitDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const client = useHttpClient();

  const handleConfirm = async () => {
    try {
      await resetUsedLimit(client, item.user.id);
      toast.success('Used limit reset successfully');
    } catch (error) {
      toast.error('Failed to reset used limit');
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={() => setChangeLimitDialogOpen(true)}>
        Change Limit
      </Button>
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
          onConfirm={handleConfirm}
          onCancel={() => setConfirmDialogOpen(false)}
          title="Reset Limit"
          description="Are you sure you want to reset the used limit?"
        />
      )}
    </div>
  );
}
