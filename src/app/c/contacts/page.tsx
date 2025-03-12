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
import FilterBar, { FilterDefinition } from '@/components/filters/FilterBar';
import { DataTable } from '@/components/dataTable/DataTable';
import { ClientContactDto } from '@/api/response/contact';
import useTablePageParams from '@/hooks/useTablePageParams';
import { createContactsColumns } from '@/ui/dataTables/contacts/contactsColumns';
import ContactFormCard, {
  ContactFormAction,
} from '@/components/contacts/contact-form-card';
import { DeleteDialog } from '@/components/DeleteDialog';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useHttpClient } from '@/context/HttpClientContext';
import {
  searchContacts,
  postNewContact,
  updateContact,
  deleteContact,
} from '@/api/contact';
import GuardBlock from '@/components/GuardBlock';

interface ContactFilter {
  nickname: string;
  accountNumber: string;
}

// Prihvaćena verzija "njihova":
const contactFilterKeyToName = (key: keyof ContactFilter): string => {
  switch (key) {
    case 'nickname':
      return 'Nickname';
    case 'accountNumber':
      return 'Account Number';
  }
};

const ContactsPage: React.FC = () => {
  const { page, pageSize, setPage, setPageSize } = useTablePageParams(
    'contacts',
    {
      pageSize: 8,
      page: 0,
    }
  );
  const [searchFilter, setSearchFilter] = useState<ContactFilter>({
    nickname: '',
    accountNumber: '',
  });
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
    queryKey: ['contact', page, pageSize, searchFilter],
    queryFn: async () => {
      const response = await searchContacts(
        client,
        searchFilter,
        pageSize,
        page
      );
      return response.data;
    },
    staleTime: 5000,
  });

  const pageCount = data?.page.totalPages ?? 0;

  // Prihvaćena verzija "njihova":
  const handleEdit = (contact: ClientContactDto) => {
    setSelectedContact(contact);
    setShowClientForm(true);
  };

  // Prihvaćena verzija "njihova":
  const handleDelete = (contact: ClientContactDto) => {
    setSelectedContact(contact);
    setShowDeleteDialog(true);
  };

  // Prihvaćena verzija "njihova":
  const handleContactSubmit = async (action: ContactFormAction) => {
    try {
      if (action.update) {
        if (!selectedContact) {
          throw new Error('No contact selected for update');
        }
        console.log('Update contact with data:', action.data);
        await updateContact(client, selectedContact.id, action.data);
      } else {
        console.log('Create new contact with data:', action.data);
        await postNewContact(client, action.data);
      }
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    } catch (error) {
      console.error('API call failed:', error);
    } finally {
      setShowClientForm(false);
      setSelectedContact(null);
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
            <FilterBar<ContactFilter, typeof contactFilterKeyToName>
              onSubmit={(filter) => {
                setPage(0);
                setSearchFilter(filter);
              }}
              filter={searchFilter}
              columns={contactFilterKeyToName}
            />
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

      {showClientForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <ContactFormCard
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
        </div>
      )}

      {showDeleteDialog && selectedContact && (
        <DeleteDialog
          open={showDeleteDialog}
          itemName={selectedContact.nickname}
          onConfirm={async () => {
            try {
              console.log('Deleting contact', selectedContact.id);
              await deleteContact(client, selectedContact.id);
              queryClient.invalidateQueries({ queryKey: ['contact'] });
            } catch (error) {
              console.error('Delete failed:', error);
            } finally {
              setShowDeleteDialog(false);
              setSelectedContact(null);
            }
          }}
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
