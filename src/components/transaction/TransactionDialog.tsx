import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TransactionDto } from '@/api/response/transaction';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { formatDateTime } from '@/lib/utils';

export const TransactionDialog = ({
  open,
  setOpen,
  dto,
}: {
  dto?: TransactionDto;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Overview</DialogTitle>
          <DialogDescription>
            Details about this transaction are shown in the following form.
          </DialogDescription>
        </DialogHeader>
        {dto && (
          <div>
            <Label>Transaction number</Label>
            <p>{dto.transactionNumber}</p>
          </div>
        )}
        {dto && (
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <Label>From account number</Label>
              <p>{dto.fromAccount}</p>
            </div>
            <div>
              <Label>To account number</Label>
              <p>{dto.toAccount}</p>
            </div>
            <div>
              <Label>From amount</Label>
              <p>{dto.fromAmount}</p>
            </div>
            <div>
              <Label>From currency</Label>
              <p>{dto.fromCurrency}</p>
            </div>
            <div>
              <Label>To amount</Label>
              <p>{dto.toAmount}</p>
            </div>
            <div>
              <Label>To currency</Label>
              <p>{dto.toCurrency}</p>
            </div>
            <div>
              <Label>Fee amount</Label>
              <p>{dto.feeAmount}</p>
            </div>
            <div>
              <Label>Fee currency</Label>
              <p>{dto.feeCurrency}</p>
            </div>
            <div>
              <Label>Recipient name</Label>
              <p>{dto.recipient}</p>
            </div>
            <div>
              <Label>Payment code</Label>
              <p>{dto.paymentCode}</p>
            </div>
            <div>
              <Label>Reference number</Label>
              <p>{dto.referenceNumber}</p>
            </div>
            {dto?.paymentPurpose && (
              <div>
                <Label>Payment purpose</Label>
                <p>{dto.paymentPurpose}</p>
              </div>
            )}
            <div>
              <Label>Payment date and time</Label>
              <p>{formatDateTime(dto.paymentDateTime)}</p>
            </div>
            <div className="flex flex-col">
              <Label>Payment status</Label>
              <Badge className="mt-2 justify-center mr-auto">
                {dto.status}
              </Badge>
            </div>
          </div>
        )}
        <div className="flex flex-col-reverse gap-2 sm:flex-row-reverse">
          <Button>Print</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
