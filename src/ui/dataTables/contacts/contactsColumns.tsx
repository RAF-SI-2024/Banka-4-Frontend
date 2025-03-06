import { ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Pretpostavljamo da tip za kontakt izgleda ovako:
export interface ContactResponseDto {
  fullName: string;
  accountNumber: string;
}

interface ContactsActionsProps {
  contact: ContactResponseDto;
  onEdit: (contact: ContactResponseDto) => void;
  onDelete: (contact: ContactResponseDto) => void;
}

export const ContactsActions = ({
  contact,
  onEdit,
  onDelete,
}: ContactsActionsProps) => {
  return (
    <div className="flex justify-end items-center space-x-2">
      <Button onClick={() => onEdit(contact)}>
        <Edit2 className="h-4 w-4" />
      </Button>
      <Button onClick={() => onDelete(contact)} variant={'destructive'}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const createContactsColumns = (
  onEdit: (contact: ContactResponseDto) => void,
  onDelete: (contact: ContactResponseDto) => void
): ColumnDef<ContactResponseDto>[] => [
  {
    accessorKey: 'fullName',
    header: 'Full Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'accountNumber',
    header: 'Account Number',
    cell: (info) => info.getValue(),
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
