import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import AccountForm, {
  AccountFormData,
} from '@/components/account/account-form';

interface FinishNewAccountProps {
  onFinishNewAccount: (account: AccountFormData) => void;
}

export default function FinalNewAccountStage(props: FinishNewAccountProps) {
  return (
    <div className={'w-full flex pt-12 justify-center'}>
      <Card className={'min-w-[400px] max-w-[400px]'}>
        <CardHeader>
          <span className={'text-2xl font-bold'}>Set up the Account</span>
          <CardDescription>
            Please select the initial amount and the currency to be used.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountForm isPending={false} onSubmit={props.onFinishNewAccount} />
        </CardContent>
      </Card>
    </div>
  );
}
