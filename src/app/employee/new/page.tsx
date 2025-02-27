'use client';
import EmployeeForm, {
  SubmitAction,
} from '@/components/employee/employee-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postNewEmployee } from '@/api/employee';
import { useHttpClient } from '@/context/HttpClientContext';
import { NewEmployeeRequest } from '@/api/request/employee';
import { toastRequestError } from '@/api/errors';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import GuardBlock from '@/components/GuardBlock';

export default function NewEmployeePage() {
  const { dispatch } = useBreadcrumb();
  const client = useHttpClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/' },
        { title: 'Employees', url: '/employee' },
        { title: 'New' },
      ],
    });
  }, [dispatch]);

  const { isPending, mutate: doNewEmployee } = useMutation({
    mutationFn: async (data: NewEmployeeRequest) =>
      postNewEmployee(client, data),
    onError: (error) => toastRequestError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employee'],
        exact: false,
      });
      toast.success('Employee created successfully');
      router.replace('/employee');
    },
  });

  function onSubmit(data: SubmitAction) {
    if (!data.update) {
      doNewEmployee({
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        username: data.data.username,
        dateOfBirth: data.data.dateOfBirth.toISOString(),
        gender: data.data.gender,
        email: data.data.email,
        phone: data.data.phoneNumber,
        address: data.data.address,
        privilege: data.data.privilege,
        position: data.data.position,
        department: data.data.department,
        active: data.data.active,
      });
    }
  }

  return (
    <GuardBlock requiredPrivileges={['ADMIN']}>
      <div className="flex justify-center items-center pt-16">
        <Card className="w-[800px]">
          <CardHeader>
            <CardTitle>Add New Employee</CardTitle>
            <CardDescription>
              Enter the employee’s details to create their account and grant
              them access to the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeeForm
              isUpdate={false}
              isPending={isPending}
              onSubmit={onSubmit}
              defaultValues={{
                firstName: '',
                lastName: '',
                dateOfBirth: undefined,
                email: '',
                address: '',
                phoneNumber: '',
                position: '',
                username: '',
                department: '',
                gender: 'male',
                active: true,
                privilege: [],
              }}
            />
          </CardContent>
        </Card>
      </div>
    </GuardBlock>
  );
}
