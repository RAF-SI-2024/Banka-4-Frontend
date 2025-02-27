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

export default function EditEmployeePage() {
  const employee: EmployeeFormValues = {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1990-05-15'),
    email: 'john.doe@example.com',
    address: '123 Main Street, Belgrade',
    phoneNumber: '+381612345678',
    position: 'Software Engineer',
    username: 'johndoe',
    department: 'IT',
    gender: 'male',
    isActive: true,
  };

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
              isPending={false}
              onSubmit={(data) => console.log('Editing Employee:', data)}
              defaultValues={employee}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
