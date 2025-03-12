import { ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatAccountNumber } from '@/lib/account-utils';

export interface ClientContactDto {
  id: string;
  nickname: string;
  accountNumber: string;
}

interface ContactsActionsProps {
  contact: ClientContactDto;
  onEdit: (contact: ClientContactDto) => void;
  onDelete: (contact: ClientContactDto) => void;
}

export const ContactsActions = ({
  contact,
  onEdit,
  onDelete,
}: ContactsActionsProps) => {
  return (
    <div className="flex justify-end items-center space-x-2">
      <Button variant={'outline'} onClick={() => onEdit(contact)}>
        <Edit2 className="h-4 w-4" />
      </Button>
      <Button onClick={() => onDelete(contact)} variant={'destructive'}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const createContactsColumns = (
  onEdit: (contact: ClientContactDto) => void,
  onDelete: (contact: ClientContactDto) => void
): ColumnDef<ClientContactDto>[] => [
  {
    accessorKey: 'nickname',
    header: 'Nickname',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'accountNumber',
    header: 'Account Number',
    cell: (info) => formatAccountNumber(info.getValue() as string),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <ContactsActions
        contact={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];
