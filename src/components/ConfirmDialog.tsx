import { MaybePromise } from '@/types/MaybePromise';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export type ConfirmDialogProps = {
  open: boolean;
  onConfirm: () => MaybePromise<unknown>;
  onCancel?: () => MaybePromise<unknown>;
  title: string;
  description: string;
  buttonText?: string;
};

export const ConfirmDialog = ({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  buttonText = 'Confirm',
}: ConfirmDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              id={'confirm-dialog-cancel'}
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              id={'confirm-dialog-confirm'}
              onClick={onConfirm}
              variant="destructive"
            >
              {buttonText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
