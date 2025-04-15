import { ColumnDef } from '@tanstack/react-table';
import { OrderDto } from '@/api/response/orders';
import { Button } from '@/components/ui/button';

export const ordersColumns = (
  handleApprove: (orderId: string) => void,
  handleDecline: (orderId: string) => void
): ColumnDef<OrderDto>[] => [
  {
    accessorKey: 'userId',
    header: 'Agent',
  },
  {
    accessorKey: 'orderType',
    header: 'Order Type',
  },
  {
    accessorKey: 'assetTicker',
    header: 'Asset',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  {
    accessorKey: 'contractSize',
    header: 'Contract Size',
  },
  {
    accessorKey: 'pricePerUnit.amount',
    header: 'Price Per Unit',
  },
  {
    accessorKey: 'direction',
    header: 'Direction',
  },
  {
    accessorKey: 'remainingPortions',
    header: 'Remaining Portions',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const order = row.original;
      return order.status === 'PENDING' ? (
        <div className="flex gap-2">
          <Button
            className="btn btn-primary"
            variant="default"
            onClick={() => handleApprove(order.id)}
          >
            Approve
          </Button>
          <Button
            className="btn btn-danger"
            variant={'destructive'}
            onClick={() => handleDecline(order.id)}
          >
            Decline
          </Button>
        </div>
      ) : null;
    },
  },
];
