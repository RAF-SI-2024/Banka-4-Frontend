import { CompanyResponseDto } from '@/api/response/company';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';

interface ViewCompanyFormProps {
  company: CompanyResponseDto;
}

export default function ViewCompanyForm({ company }: ViewCompanyFormProps) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col col-span-1">
          <Label>Company Name:</Label>
          <Input
            disabled
            type="text"
            className={'disabled:cursor-default'}
            value={company.name}
          />
        </div>
        <div className="flex flex-col col-span-1">
          <Label>Tax Identification Number:</Label>
          <Input
            disabled
            type="text"
            className={'disabled:cursor-default'}
            value={company.tin}
          />
        </div>
        <div className="flex flex-col col-span-1">
          <Label>Company Registration Number:</Label>
          <Input
            disabled
            type="text"
            className={'disabled:cursor-default'}
            value={company.crn}
          />
        </div>
        <div className="flex flex-col col-span-1">
          <Label>Address:</Label>
          <Input
            disabled
            type="text"
            className={'disabled:cursor-default'}
            value={company.address}
          />
        </div>
        <div className="flex flex-col col-span-1">
          <Label>Activity Code:</Label>
          <Input
            disabled
            type="text"
            className={'disabled:cursor-default'}
            value={company.activityCode}
          />
        </div>
      </div>
    </>
  );
}
