import {
  paymentStatusToString,
  TransactionDto,
} from '@/api/response/transaction';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn, formatDateTime } from '@/lib/utils';

/** Formatter for {@link TransactionDetails}.
 *  @param p.children - value of the field.
 *  @param p.name - name of the field.
 *  @param p.isFirst - whether this field is the first field in the output.
 */
export type TXDetailsFieldFormatter = (p: {
  children: React.ReactNode;
  name: string;
  isFirst: boolean;
}) => React.ReactNode;

const defaultFieldFormatter: TXDetailsFieldFormatter = ({
  children,
  name,
  isFirst,
}) => (
  <div className={cn(isFirst && 'col-span-2')}>
    <Label className="text-muted-foreground row-span-2">{name}</Label>
    {children}
  </div>
);

/** Render a transaction using a customizable formatter.  Kinda an ugly
 *  solution to be honest.
 *  @param dto - transaction to display.
 *  @param fieldFormatter - how to format each transaction field
 *  @param raw - if false, wraps the body in a two-column grid
 */
export default function TransactionDetails({
  dto,
  fieldFormatter = defaultFieldFormatter,
  raw = false,
}: {
  dto: TransactionDto;
  fieldFormatter?: TXDetailsFieldFormatter;
  raw?: boolean;
}) {
  const rawRows = (
    <>
      {fieldFormatter({
        name: 'Transaction number',
        children: <p>{dto.transactionNumber}</p>,
        isFirst: true,
      })}
      {fieldFormatter({
        name: 'From account number',
        children: <p>{dto.fromAccount}</p>,
        isFirst: false,
      })}
      {fieldFormatter({
        name: 'To account number',
        children: <p>{dto.toAccount}</p>,
        isFirst: false,
      })}
      {fieldFormatter({
        name: 'From amount',
        children: <p>{dto.fromAmount}</p>,
        isFirst: false,
      })}
      {fieldFormatter({
        name: 'From currency',
        children: <p>{dto.fromCurrency}</p>,
        isFirst: false,
      })}
      {fieldFormatter({
        name: 'To amount',
        children: <p>{dto.toAmount}</p>,
        isFirst: false,
      })}
      {fieldFormatter({
        name: 'To currency',
        children: <p>{dto.toCurrency}</p>,
        isFirst: false,
      })}
      {fieldFormatter({
        name: 'Fee amount',
        children: <p>{dto.feeAmount}</p>,
        isFirst: false,
      })}
      {fieldFormatter({
        name: 'Fee currency',
        children: <p>{dto.feeCurrency}</p>,
        isFirst: false,
      })}
      {fieldFormatter({
        name: 'Recipient name',
        children: <p>{dto.recipient}</p>,
        isFirst: false,
      })}
      {fieldFormatter({
        name: 'Payment code',
        children: <p>{dto.paymentCode}</p>,
        isFirst: false,
      })}
      {fieldFormatter({
        name: 'Reference number',
        children: <p>{dto.referenceNumber}</p>,
        isFirst: false,
      })}
      {dto.paymentPurpose &&
        fieldFormatter({
          name: 'Payment purpose',
          children: <p>{dto.paymentPurpose}</p>,
          isFirst: false,
        })}
      {fieldFormatter({
        name: 'Payment date and time',
        children: <p>{formatDateTime(dto.paymentDateTime)}</p>,
        isFirst: false,
      })}
      {fieldFormatter({
        name: 'Payment status',
        children: (
          <Badge className="block mt-2 justify-center mr-auto w-fit">
            {paymentStatusToString(dto.status).toUpperCase()}
          </Badge>
        ),
        isFirst: false,
      })}
    </>
  );
  if (raw) return rawRows;

  return <div className="grid grid-cols-2 gap-y-4">{rawRows}</div>;
}
