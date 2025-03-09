import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Card } from '../../types/card';
import { Button } from '@/components/ui/button';
import { CardInfoForm } from './card-info-form';

export type CardInfoDialogProps = {
  open: boolean;
  onClose: () => void;
  item: Card;
};

export const CardInfoDialog = ({
  open,
  onClose,
  item,
}: CardInfoDialogProps) => {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={'text-2xl'}>Account Details</DialogTitle>
        </DialogHeader>
        <CardInfoForm {...item} />
        <DialogClose asChild>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
