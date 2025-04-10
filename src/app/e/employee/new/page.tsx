'use client';
import EmployeeForm, {
  EmployeeFormAction,
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
import { useMutation } from '@tanstack/react-query';
import { postNewEmployee } from '@/api/employee';
import { useHttpClient } from '@/context/HttpClientContext';
import { NewEmployeeRequest } from '@/api/request/employee';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import GuardBlock from '@/components/GuardBlock';

export default function NewEmployeePage() {
  const { dispatch } = useBreadcrumb();
  const client = useHttpClient();
  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/e' },
        { title: 'Employees', url: '/e/employee' },
        { title: 'New' },
      ],
    });
  }, [dispatch]);

  const { isPending, mutate: doNewEmployee } = useMutation({
    mutationKey: ['employee'],
    mutationFn: async (data: NewEmployeeRequest) =>
      postNewEmployee(client, data),
    onSuccess: () => {
      toast.success('Employee created successfully');
      router.push('/e/employee');
    },
  });

  function onSubmit(data: EmployeeFormAction) {
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
        privilege: data.data.privilege === null ? [] : [data.data.privilege],
        position: data.data.position,
        department: data.data.department,
        active: data.data.active,
      });
    }
  }

  return (
    <GuardBlock requiredUserType={'employee'} requiredPrivileges={['ADMIN']}>
      <div className="flex justify-center items-center py-12">
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
                gender: 'MALE',
                active: true,
                privilege: null,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </GuardBlock>
  );
}
