'use client';
import EmployeeForm, {
  EmployeeFormAction,
  EmployeeFormValues,
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
        { title: 'Home', url: '/e' },
        { title: 'Employees', url: '/e/employee' },
        { title: 'Edit' },
      ],
    });
  }, [dispatch]);

  const { isPending: isPendingUpdate, mutate: doUpdate } = useMutation({
    mutationKey: ['employee', params.id],
    mutationFn: async (data: EditEmployeeRequest) =>
      updateEmployeeById(client, params.id, data),
    onSuccess: () => {
      toast.success('Employee updated successfully');
      router.push('/e/employee');
    },
  });

  if (!isSuccess) {
    if (error) {
      toastRequestError(error);
      router.back();
    }
    return;
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
    gender: data.gender,
    active: data.active,
    privilege: data.privileges[0] ?? null,
  };

  function onSubmit(data: EmployeeFormAction) {
    if (data.update) {
      doUpdate({
        ...data.data,
        dateOfBirth: data.data.dateOfBirth?.toISOString(),
        privilege: !data.data.privilege ? [] : [data.data.privilege],
      });
    }
  }

  return (
    <GuardBlock requiredUserType={'employee'} requiredPrivileges={['ADMIN']}>
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
