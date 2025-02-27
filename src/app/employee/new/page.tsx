'use client';
import EmployeeForm from '@/components/employee/employee-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useEffect } from 'react';

export default function NewEmployeePage() {
  const { dispatch } = useBreadcrumb();
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
              onSubmit={(data) => console.log('Creating Employee:', data)}
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
