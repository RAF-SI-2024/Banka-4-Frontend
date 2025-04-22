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
    cell: (info) => {
      const card = info.row.original;

      return (
        <div className="flex space-x-2">
          <Button onClick={() => onInfo(card)}>Info</Button>
          {card.cardStatus === 'ACTIVATED' && (
            <Button
              id={`block-${info.row.index}`}
              onClick={() => onBlock(card)}
              variant="destructive"
            >
              Block
            </Button>
          )}
        </div>
      );
    },
  },
];
