import { ColumnDef } from '@tanstack/react-table';
import { AccountDto } from '@/api/response/account';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AccountInfoDialog } from '@/components/account/account-info-dialog';
import { AlignJustify } from 'lucide-react';
import { formatAccountNumber } from '@/lib/account-utils';

export const accountsColumns: ColumnDef<AccountDto>[] = [
  {
    accessorKey: 'accountNumber',
    header: 'Account Number',
    cell: (info) => formatAccountNumber(info.getValue() as string),
  },
  {
    accessorKey: 'client.firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'client.lastName',
    header: 'Last Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'accountType',
    header: 'Account Type',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => handleEdit(row.original)}>
          <AlignJustify />
        </Button>
        <AccountInfoDialog
          item={{
            accountNumber: row.original.accountNumber,
            balance: row.original.balance,
            valuta: row.original.currency.code,
            owner:
              row.original.client.firstName +
              ' ' +
              row.original.client.lastName,
            type: row.original.accountType,
            availableResources: row.original.availableBalance,
            reservedResources: 0,
          }}
        />
      </div>
    ),
  },
];

const handleEdit = (account: AccountDto) => {
  <Link href={`#`}></Link>;
  console.log('See transaction:', account);
};
