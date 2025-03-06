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
import { useState } from 'react';
import { createPortal } from 'react-dom';
import TransactionDetails from './TransactionDetails';

export const TransactionDialog = ({
  open,
  setOpen,
  dto,
}: {
  dto: TransactionDto;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [printerWindow, setPrinterWindow] = useState<Window | null>(null);

  function doPrint() {
    printerWindow?.print();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Overview</DialogTitle>
          <DialogDescription>
            Details about this transaction are shown in the following form.
          </DialogDescription>
        </DialogHeader>
        <TransactionDetails dto={dto} />
        <iframe
          className="hidden"
          onLoad={(e) => setPrinterWindow(e.currentTarget.contentWindow)}
        />
        <div className="flex flex-col-reverse gap-2 sm:flex-row-reverse">
          {printerWindow?.document.body &&
            createPortal(
              <>
                <style>{`td { border-bottom: 0.1mm solid black; }`}</style>
                <table>
                  <tbody>
                    <TransactionDetails
                      dto={dto}
                      fieldFormatter={({ name, children }) => (
                        <tr>
                          <td>{name}</td>
                          <td>{children}</td>
                        </tr>
                      )}
                      raw={true}
                    />
                  </tbody>
                </table>
              </>,
              printerWindow.document.body
            )}
          <Button onClick={doPrint}>Print</Button>
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
