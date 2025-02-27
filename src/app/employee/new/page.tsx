'use client';
import EmployeeForm, {
  EmployeeFormValues,
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
import { toastRequestError } from '@/api/errors';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function NewEmployeePage() {
  const { dispatch } = useBreadcrumb();
  const client = useHttpClient();
  const router = useRouter();

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
      toast.success('Employee created successfully');
      router.replace('/employee');
    },
  });

  function onSubmit(data: EmployeeFormValues) {
    doNewEmployee({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      dateOfBirth: data.dateOfBirth.toISOString(),
      gender: data.gender,
      email: data.email,
      phone: data.phoneNumber,
      address: data.address,
      privilege: ['ADMIN'],
      position: data.position,
      department: data.department,
    });
  }

  return (
    <div>
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
                isActive: true,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
