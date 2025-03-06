import { ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Pretpostavljamo da tip za kontakt izgleda ovako:
export interface ContactResponseDto {
  id: string;
  name: string;
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
      <button
        onClick={() => onEdit(contact)}
        className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
      >
        <Edit2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => onDelete(contact)}
        className="p-1 text-red-600 hover:text-red-800"
      >
        <Trash className="h-4 w-4" />
      </button>
    </div>
  );
};

export const createContactsColumns = (
  onEdit: (contact: ContactResponseDto) => void,
  onDelete: (contact: ContactResponseDto) => void
): ColumnDef<ContactResponseDto>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
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
