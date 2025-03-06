import { ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DeleteDialog } from '@/components/DeleteDialog';
import ContactForm from '@/components/contacts/contact-form';

// Pretpostavljamo da tip za kontakt izgleda ovako:
export interface ContactResponseDto {
  id: string;
  name: string;
  accountNumber: string;
}

const ContactsActions = ({ contact }: { contact: ContactResponseDto }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div className="flex justify-end items-center space-x-2">
      <button
        onClick={() => setShowEditDialog(true)}
        className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
      >
        <Edit2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => setShowDeleteDialog(true)}
        className="p-1 text-red-600 hover:text-red-800"
      >
        <Trash className="h-4 w-4" />
      </button>
      {showEditDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-black rounded-lg p-6 shadow-2xl">
            <ContactForm
              contact={contact}
              onClose={() => setShowEditDialog(false)}
            />
          </div>
        </div>
      )}
      {showDeleteDialog && (
        <DeleteDialog
          open={showDeleteDialog}
          itemName={contact.name}
          onConfirm={() => {
            console.log('Deleting contact', contact.id);
            // TODO: Call delete API method here
            setShowDeleteDialog(false);
          }}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
};

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
    header: '',
    cell: ({ row }) => <ContactsActions contact={row.original} />,
  },
];
