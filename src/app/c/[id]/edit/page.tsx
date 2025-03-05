'use client';
import ClientForm, {
  ClientFormValues,
  ClientFormAction,
} from '@/components/client/client-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useHttpClient } from '@/context/HttpClientContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { toastRequestError } from '@/api/errors';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import GuardBlock from '@/components/GuardBlock';
import { EditClientRequest } from '@/api/request/client';
import { getClientById, updateClientById } from '@/api/client';
import { Gender, normalizeGender } from '@/types/gender';

type EditClientParams = {
  id: string;
};
export default function EditClientPage() {
  const params = useParams<EditClientParams>();
  const { dispatch } = useBreadcrumb();
  const router = useRouter();
  const queryClient = useQueryClient();

  const client = useHttpClient();
  const {
    data,
    isPending: isPendingFetch,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['client', params.id],
    queryFn: async () => (await getClientById(client, params.id)).data,
  });

  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/' },
        { title: 'Clients', url: '/e/client' },
        { title: 'Edit' },
      ],
    });
  }, [dispatch]);

  const { isPending: isPendingUpdate, mutate: doUpdate } = useMutation({
    mutationKey: ['client', params.id],
    mutationFn: async (data: EditClientRequest) =>
      updateClientById(client, params.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['client'],
        exact: false,
      });
      toast('Client updated successfully');
      router.push('/e/client');
    },
    onError: (error) => toastRequestError(error),
  });

  if (!isSuccess) {
    if (error) {
      toastRequestError(error);
      router.back();
    }
    return;
  }

  const gender: Gender = normalizeGender(data.gender);

  const clientForEdit: ClientFormValues = {
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: new Date(data.dateOfBirth),
    email: data.email,
    phoneNumber: data.phone,
    address: data.address,
    gender: gender,
    privilege: data.privileges,
  };

  function onSubmit(data: ClientFormAction) {
    if (data.update) {
      doUpdate({
        ...data.data,
        dateOfBirth: data.data.dateOfBirth?.toISOString(),
      });
    }
  }

  return (
    <GuardBlock requiredPrivileges={['ADMIN']}>
      <div className="flex justify-center items-center pt-16">
        <Card className="w-[800px]">
          <CardHeader>
            <CardTitle>Edit Client Details</CardTitle>
            <CardDescription>Update the client’s information.</CardDescription>
          </CardHeader>
          <CardContent>
            <ClientForm
              isUpdate={true}
              isPending={isPendingFetch || isPendingUpdate}
              onSubmitAction={onSubmit}
              defaultValues={clientForEdit}
            />
          </CardContent>
        </Card>
      </div>
    </GuardBlock>
  );
}
