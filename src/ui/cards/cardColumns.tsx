import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { CardResponseDto } from '@/api/response/cards';

export const cardColumns = (
  onBlock: (card: CardResponseDto) => void,
  onInfo: (card: CardResponseDto) => void
): ColumnDef<CardResponseDto>[] => [
  {
    accessorKey: 'cardNumber',
    header: 'Card Number',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'cardName',
    header: 'Card Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'cardType',
    header: 'Card Type',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'expirationDate',
    header: 'Expiration Date',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'cardStatus',
    header: 'Card Status',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: (info) => (
      <div className="flex space-x-2">
        <Button onClick={() => onInfo(info.row.original)}>Info</Button>
        <Button
          onClick={() => onBlock(info.row.original)}
          variant="destructive"
        >
          Block
        </Button>
      </div>
    ),
  },
];
