import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ListingFilters } from './ListingFilters';
import { isValidSecurityType } from '../isValidSecurityType';

export default async function Page({
  params,
  children,
}: {
  params: Promise<{ securityType: string }>;
  children: React.ReactNode;
}) {
  const securityType = (await params).securityType;

  if (!isValidSecurityType(securityType)) return notFound();

  const component = (
    <div>
      <ListingFilters
        withSettlementDate={securityType === 'futures'}
        securityType={securityType}
      />
      {children}
    </div>
  );

  return (
    <div>
      <Tabs defaultValue={securityType}>
        <TabsList>
          <TabsTrigger value="stocks" className="!p-0 !m-0">
            <Link className="p-2 min-w-[120px]" href={'/u/stocks'}>
              Stocks
            </Link>
          </TabsTrigger>
          <TabsTrigger value="futures" className="!p-0 !m-0">
            <Link className="p-2 min-w-[120px]" href={'/u/futures'}>
              Futures
            </Link>
          </TabsTrigger>
          <TabsTrigger value="forex-pairs" className="!p-0 !m-0">
            <Link className="p-2 min-w-[120px]" href={'/u/forex-pairs'}>
              Forex Pairs
            </Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stocks">{component}</TabsContent>
        <TabsContent value="futures">{component}</TabsContent>
        <TabsContent value="forex-pairs">{component}</TabsContent>
      </Tabs>
    </div>
  );
}
