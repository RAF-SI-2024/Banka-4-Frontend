import { BadgeCheck } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-full w-full flex flex-items justify-center items-center -mt-[64px]">
      <div className="w-full flex flex-col items-center mx-4">
        <BadgeCheck className="w-[220px] h-[220px] text-green-500 dark:text-gray-300" />
        <div className="text-center">
          <p className="text-lg pb-2 my-4">
            Loan was requested successfully. You will get a confirmation as soon
            as it&apos;s approved.
          </p>
          Go back{' '}
          <Link className="text-blue-500 dark:text-blue-400" href={'/'}>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
