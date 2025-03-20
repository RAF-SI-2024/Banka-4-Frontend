import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import { MaybePromise } from '@/types/MaybePromise';

interface AccountViewLimitsProps {
  currencyCode: string;
  monthlyLimit: number;
  dailyLimit: number;
  onClickChangeLimits?: () => MaybePromise<unknown>;
}

export default function AccountViewLimits(props: AccountViewLimitsProps) {
  return (
    <>
      <div className="flex flex-row justify-between">
        <h2 className="font-semibold text-xl mb-4">Limits</h2>
        {props.onClickChangeLimits != null && (
          <Button
            variant="secondary"
            onClick={async (e) => {
              e.preventDefault();
              await props.onClickChangeLimits?.();
            }}
          >
            Change
          </Button>
        )}
      </div>
      <div className=" w-full flex flex-col gap-2">
        <div className="flex flex-col flex-1">
          <Label>Daily Limit:</Label>
          <Input
            disabled
            className={'disabled:cursor-default'}
            value={`${props.dailyLimit.toLocaleString()} ${props.currencyCode}`}
          />
        </div>
        <div className="flex flex-col flex-1">
          <Label>Monthly Limit:</Label>
          <Input
            disabled
            className={'disabled:cursor-default'}
            value={`${props.monthlyLimit.toLocaleString()} ${props.currencyCode}`}
          />
        </div>
      </div>
    </>
  );
}
