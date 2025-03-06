'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import ClientForm, {
  ClientFormAction,
  ClientFormValues,
} from '@/components/client/client-form';

interface NewClientProps {
  onNewClientSubmitted: (client: ClientFormValues) => void;
}

export default function NewClientStage(props: NewClientProps) {
  function _clientFormSubmitted(action: ClientFormAction) {
    if (!action.update) {
      props.onNewClientSubmitted(action.data);
    }
  }

  return (
    <div className={'w-full flex pt-12 justify-center'}>
      <Card className={'min-w-[900px]'}>
        <CardHeader>
          <span className={'text-2xl font-bold'}>New Client</span>
          <CardDescription>
            Enter the information about the new client you are creating.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientForm
            onSubmitAction={_clientFormSubmitted}
            isPending={false}
            isUpdate={false}
            defaultValues={{
              firstName: '',
              lastName: '',
              dateOfBirth: undefined,
              email: '',
              phoneNumber: '',
              address: '',
              gender: 'Male',
              privilege: [],
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
