import { ColumnDef } from '@tanstack/react-table';
import { MoreVertical, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

// Pretpostavljamo da tip za kontakt izgleda :
export interface ContactResponseDto {
  id: string;
  name: string;
  accountNumber: string;
}

export const contactsColumns: ColumnDef<ContactResponseDto>[] = [
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
    header: 'Actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              // TODO: When dialogs are available, open the edit dialog for the selected contact.
              console.log('Edit contact', row.original.id);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              // TODO: When dialogs are available, open the delete confirm dialog for the selected contact.
              console.log('Delete contact', row.original.id);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
