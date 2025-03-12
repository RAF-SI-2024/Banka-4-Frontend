'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/dataTable/DataTable';
import { ClientContactDto } from '@/api/response/contact';
import useTablePageParams from '@/hooks/useTablePageParams';
import { createContactsColumns } from '@/ui/dataTables/contacts/contactsColumns';
import ContactFormDialog, {
  ContactFormAction,
} from '@/components/contacts/contact-form-dialog';
import { DeleteDialog } from '@/components/DeleteDialog';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useHttpClient } from '@/context/HttpClientContext';
import {
  searchContacts,
  postNewContact,
  updateContact,
  deleteContact,
} from '@/api/contact';
import GuardBlock from '@/components/GuardBlock';
import { toastRequestError } from '@/api/errors';

const ContactsPage: React.FC = () => {
  const { page, pageSize, setPage, setPageSize } = useTablePageParams(
    'contacts',
    {
      pageSize: 8,
      page: 0,
    }
  );

  const [showClientForm, setShowClientForm] = useState(false);
  const [selectedContact, setSelectedContact] =
    useState<ClientContactDto | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/c' },
        { title: 'Contacts', url: '/c/contacts' },
        { title: 'Overview' },
      ],
    });
  }, [dispatch]);

  const client = useHttpClient();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['contact', page, pageSize],
    queryFn: async () => {
      const response = await searchContacts(
        client,
        { nickname: '', accountNumber: '' },
        pageSize,
        page
      );
      return response.data;
    },
    staleTime: 5000,
  });

  const pageCount = data?.page.totalPages ?? 0;

  const handleEdit = (contact: ClientContactDto) => {
    setSelectedContact(contact);
    setShowClientForm(true);
  };

  const handleDelete = (contact: ClientContactDto) => {
    setSelectedContact(contact);
    setShowDeleteDialog(true);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await deleteContact(client, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
    onError: (error) => {
      toastRequestError(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      updateData: Partial<ClientContactDto>;
    }) => await updateContact(client, data.id, data.updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
    onError: (error) => {
      toastRequestError(error);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { nickname: string; accountNumber: string }) =>
      await postNewContact(client, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
    onError: (error) => {
      toastRequestError(error);
    },
  });

  const handleDeleteConfirm = () => {
    if (!selectedContact) return;
    deleteMutation.mutate(selectedContact.id, {
      onSettled: () => {
        setShowDeleteDialog(false);
        setSelectedContact(null);
      },
    });
  };

  const handleContactSubmit = (action: ContactFormAction) => {
    if (action.update) {
      if (!selectedContact) {
        throw Error('No contact selected for update');
      }
      updateMutation.mutate(
        { id: selectedContact.id, updateData: action.data },
        {
          onSettled: () => {
            setShowClientForm(false);
            setSelectedContact(null);
          },
        }
      );
    } else {
      createMutation.mutate(action.data, {
        onSettled: () => {
          setShowClientForm(false);
          setSelectedContact(null);
        },
      });
    }
  };

  const handleContactCancel = () => {
    setShowClientForm(false);
    setSelectedContact(null);
  };

  const columns = createContactsColumns(handleEdit, handleDelete);

  return (
    <GuardBlock requiredUserType={'client'}>
      <div className="p-8">
        <Card className="max-w-[900px] mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Contacts</h1>
                <CardDescription>
                  Manage your contacts. Use the actions to edit or delete
                  contacts.
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  setSelectedContact(null);
                  setShowClientForm(true);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {/* FilterBar removed per feedback */}
          </CardHeader>
          <CardContent className="rounded-lg overflow-hidden">
            <DataTable<ClientContactDto>
              onRowClick={() => {}}
              columns={columns}
              data={data?.content ?? []}
              isLoading={isLoading}
              pageCount={pageCount}
              pagination={{ page, pageSize }}
              onPaginationChange={(newPagination) => {
                setPage(newPagination.page);
                setPageSize(newPagination.pageSize);
              }}
            />
          </CardContent>
        </Card>
      </div>

      <ContactFormDialog
        open={showClientForm}
        onOpenChange={setShowClientForm}
        contact={
          selectedContact
            ? {
                nickname: selectedContact.nickname,
                accountNumber: selectedContact.accountNumber,
              }
            : null
        }
        onSubmit={handleContactSubmit}
        onCancel={handleContactCancel}
        isPending={
          createMutation.status === 'pending' ||
          updateMutation.status === 'pending'
        }
      />

      {showDeleteDialog && selectedContact && (
        <DeleteDialog
          open={showDeleteDialog}
          itemName={selectedContact.nickname}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteDialog(false);
            setSelectedContact(null);
          }}
        />
      )}
    </GuardBlock>
  );
};

export default ContactsPage;
