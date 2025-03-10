import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LoanDto } from '@/api/response/loan';
import { Label } from '../ui/label';

export const LoanDialog = ({
  open,
  setOpen,
  dto,
}: {
  dto: LoanDto;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Loan Overview</DialogTitle>
          <DialogDescription>
            Details about this Loan are shown in the following form.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="">
            <Label className="text-muted-foreground row-span-2">
              Loan number
            </Label>
            <p>{dto.loanNumber}</p>
          </div>
          <div className="">
            <Label className="text-muted-foreground row-span-2">Type</Label>
            <p>{dto.type}</p>
          </div>
          <div className="">
            <Label className="text-muted-foreground row-span-2">Amount</Label>
            <p>{dto.amount}</p>
          </div>
          <div className="">
            <Label className="text-muted-foreground row-span-2">
              Repayment Period
            </Label>
            <p>{dto.repaymentPeriod}</p>
          </div>
          <div className="">
            <Label className="text-muted-foreground row-span-2">
              Interest Rate
            </Label>
            <p>{dto.interestRate}</p>
          </div>
          <div className="">
            <Label className="text-muted-foreground row-span-2">
              Effective Interest Rate
            </Label>
            <p>{dto.effectiveInterestRate}</p>
          </div>
          <div className="">
            <Label className="text-muted-foreground row-span-2">
              Agreement Date
            </Label>
            <p>{dto.agreementDate}</p>
          </div>
          <div className="">
            <Label className="text-muted-foreground row-span-2">Due Date</Label>
            <p>{dto.dueDate}</p>
          </div>
          <div className="">
            <Label className="text-muted-foreground row-span-2">
              Next Installment Amount
            </Label>
            <p>{dto.nextInstallmentAmount}</p>
          </div>
          <div className="">
            <Label className="text-muted-foreground row-span-2">
              Next Installment Date
            </Label>
            <p>{dto.nextInstallmentDate}</p>
          </div>
          <div className="">
            <Label className="text-muted-foreground row-span-2">
              Remaining Debt
            </Label>
            <p>{dto.remainingDebt}</p>
          </div>
          <div className="">
            <Label className="text-muted-foreground row-span-2">Currency</Label>
            <p>{dto.currency.code}</p>
          </div>
        </div>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
