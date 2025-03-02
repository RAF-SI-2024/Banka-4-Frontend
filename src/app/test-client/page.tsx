'use client';
import ClientForm, { ClientFormAction } from '@/components/client/client-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';

export default function NewClientPage() {
  const [formData, setFormData] = useState<ClientFormAction | null>(null);

  function onSubmit(data: ClientFormAction) {
    console.log('Form Submitted:', data);
    setFormData(data);
  }

  return (
    <div className="flex justify-center items-center pt-16">
      <Card className="w-[800px]">
        <CardHeader>
          <CardTitle>Add New Client</CardTitle>
          <CardDescription>
            Enter the client’s details to create their account and grant them
            access to the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientForm
            isUpdate={false}
            isPending={false}
            onSubmit={onSubmit}
            defaultValues={{
              firstName: '',
              lastName: '',
              dateOfBirth: new Date(),
              email: '',
              address: '',
              phoneNumber: '',
              gender: 'male',
              privilege: []

            }}
          />
          {formData && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
              <h2 className="font-semibold">Submitted Data:</h2>
              <pre className="text-sm text-gray-700">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
