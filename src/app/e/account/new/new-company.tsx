import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import CompanyForm, {
  CompanyFormData,
} from '@/components/company/company-form';

interface NewBusinessProps {
  onNewCompanySubmitted: (business: CompanyFormData) => void;
}

export default function NewCompanyStage(props: NewBusinessProps) {
  return (
    <div className={'w-full flex pt-12 justify-center'}>
      <Card className={'min-w-[400px] max-w-[400px]'}>
        <CardHeader>
          <span className={'text-2xl font-bold'}>New Company</span>
          <CardDescription>
            Enter the information about the new company.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompanyForm
            isPending={false}
            onSubmitAction={props.onNewCompanySubmitted}
          />
        </CardContent>
      </Card>
    </div>
  );
}
