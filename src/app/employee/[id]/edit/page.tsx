'use client';
import EmployeeForm, {
  EmployeeFormValues,
  EmployeeFormAction,
} from '@/components/employee/employee-form';
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
import { getEmployeeById, updateEmployeeById } from '@/api/employee';
import { toastRequestError } from '@/api/errors';
import { EditEmployeeRequest } from '@/api/request/employee';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import GuardBlock from '@/components/GuardBlock';

type EditEmployeeParams = {
  id: string;
};
export default function EditEmployeePage() {
  const params = useParams<EditEmployeeParams>();
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
    queryKey: ['employee', params.id],
    queryFn: async () => (await getEmployeeById(client, params.id)).data,
  });

  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/' },
        { title: 'Employees', url: '/employee' },
        { title: 'Edit' },
      ],
    });
  }, [dispatch]);

  const { isPending: isPendingUpdate, mutate: doUpdate } = useMutation({
    mutationKey: ['employee', params.id],
    mutationFn: async (data: EditEmployeeRequest) =>
      updateEmployeeById(client, params.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employee'],
        exact: false,
      });
      toast('Employee updated successfully');
      router.push('/employee');
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

  /* no time, gotta go fast */
  let gender: 'male' | 'female';
  if (data.gender.toLowerCase() === 'male') {
    gender = 'male';
  } else {
    gender = 'female';
  }

  const employee: EmployeeFormValues = {
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: new Date(data.dateOfBirth),
    email: data.email,
    address: data.address,
    phoneNumber: data.phone,
    position: data.position,
    username: data.username,
    department: data.department,
    gender: gender,
    active: data.active,
    privilege: data.privileges,
  };

  function onSubmit(data: EmployeeFormAction) {
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
            <CardTitle>Edit Employee Details</CardTitle>
            <CardDescription>
              Update the employee’s information and manage their account status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeeForm
              isUpdate={true}
              isPending={isPendingFetch || isPendingUpdate}
              onSubmit={onSubmit}
              defaultValues={employee}
            />
          </CardContent>
        </Card>
      </div>
    </GuardBlock>
  );
}
