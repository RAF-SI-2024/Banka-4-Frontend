import OfferForm, { OfferFormProps } from '@/components/otc/offer-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export type OfferDialogProps = OfferFormProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OfferDialog(props: OfferDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className={'!max-w-md mx-auto'}>
        <DialogHeader>
          <DialogTitle className={'text-2xl'}>Make an Offer</DialogTitle>
        </DialogHeader>
        <OfferForm
          isUpdate={props.isUpdate}
          isPending={props.isPending}
          defaultValues={props.defaultValues}
          onSubmit={props.onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
