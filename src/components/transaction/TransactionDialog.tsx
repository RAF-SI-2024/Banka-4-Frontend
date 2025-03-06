import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  paymentStatusToString,
  TransactionDto,
} from '@/api/response/transaction';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { formatDateTime } from '@/lib/utils';

export const TransactionDialog = ({
  open,
  setOpen,
  dto,
}: {
  dto: TransactionDto;
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
        <div>
          <Label className={'text-muted-foreground'}>Transaction number</Label>
          <p>{dto.transactionNumber}</p>
        </div>
        <div className="grid grid-cols-2 gap-y-4">
          <div>
            <Label className={'text-muted-foreground'}>
              From account number
            </Label>
            <p>{dto.fromAccount}</p>
          </div>
          <div>
            <Label className={'text-muted-foreground'}>To account number</Label>
            <p>{dto.toAccount}</p>
          </div>
          <div>
            <Label className={'text-muted-foreground'}>From amount</Label>
            <p>{dto.fromAmount}</p>
          </div>
          <div>
            <Label className={'text-muted-foreground'}>From currency</Label>
            <p>{dto.fromCurrency}</p>
          </div>
          <div>
            <Label className={'text-muted-foreground'}>To amount</Label>
            <p>{dto.toAmount}</p>
          </div>
          <div>
            <Label className={'text-muted-foreground'}>To currency</Label>
            <p>{dto.toCurrency}</p>
          </div>
          <div>
            <Label className={'text-muted-foreground'}>Fee amount</Label>
            <p>{dto.feeAmount}</p>
          </div>
          <div>
            <Label className={'text-muted-foreground'}>Fee currency</Label>
            <p>{dto.feeCurrency}</p>
          </div>
          <div>
            <Label className={'text-muted-foreground'}>Recipient name</Label>
            <p>{dto.recipient}</p>
          </div>
          <div>
            <Label className={'text-muted-foreground'}>Payment code</Label>
            <p>{dto.paymentCode}</p>
          </div>
          <div>
            <Label className={'text-muted-foreground'}>Reference number</Label>
            <p>{dto.referenceNumber}</p>
          </div>
          {dto.paymentPurpose && (
            <div>
              <Label className={'text-muted-foreground'}>Payment purpose</Label>
              <p>{dto.paymentPurpose}</p>
            </div>
          )}
          <div>
            <Label className={'text-gray-500'}>Payment date and time</Label>
            <p>{formatDateTime(dto.paymentDateTime)}</p>
          </div>
          <div className="flex flex-col">
            <Label className={'text-gray-500'}>Payment status</Label>
            <Badge className="mt-2 justify-center mr-auto">
              {paymentStatusToString(dto.status).toUpperCase()}
            </Badge>
          </div>
        </div>
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
