'use client';

import { formatDistanceToNow, format } from 'date-fns';
import {
  ArrowDownUp,
  Calendar,
  CircleDollarSign,
  Coins,
  DollarSign,
  LineChart,
  Package2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ListingDetailsDto } from '@/api/response/listing';

interface ListingCardProps {
  listing: ListingDetailsDto;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const data = listing;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })
    .format(data.price)
    .slice(1);

  const getSecurityBadgeColor = () => {
    switch (data.securityType) {
      case 'STOCK':
        return 'bg-blue-100 text-blue-800';
      case 'FUTURE':
        return 'bg-purple-100 text-purple-800';
      case 'FOREX-PAIR':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderChangeIndicator = () => {
    if (data.change === 0) {
      return (
        <div className="flex items-center text-yellow-600">
          <span className="font-medium">No change</span>
        </div>
      );
    } else if (data.change > 0) {
      return (
        <div className="flex items-center text-green-600">
          <TrendingUp className="mr-1 h-5 w-5" />
          <span className="font-medium">+{data.change}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-red-600">
          <TrendingDown className="mr-1 h-5 w-5" />
          <span className="font-medium">{data.change}%</span>
        </div>
      );
    }
  };

  const renderSpecificDetails = () => {
    switch (data.securityType) {
      case 'STOCK': {
        const stock = data;
        const marketCap = stock.price * stock.outstandingShares;
        const formattedMarketCap = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          notation: 'compact',
          maximumFractionDigits: 2,
        }).format(marketCap);

        const formattedDividendYield = new Intl.NumberFormat('en-US', {
          style: 'percent',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(stock.dividendYield);

        const createdDate = new Date(stock.createdAt);
        const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

        return (
          <>
            <TabsContent value="overview" className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="font-medium">{formattedMarketCap}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Dividend Yield
                  </p>
                  <p className="font-medium">{formattedDividendYield}</p>
                </div>
              </div>
              <div className="flex items-center justify-center py-2">
                {renderChangeIndicator()}
              </div>
            </TabsContent>
            <TabsContent value="details" className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Outstanding Shares
                  </span>
                  <span className="font-medium">
                    {stock.outstandingShares.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Volume</span>
                  <span className="font-medium">
                    {stock.volume.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="font-medium">{timeAgo}</span>
                </div>
              </div>
            </TabsContent>
          </>
        );
      }

      case 'FUTURE': {
        const future = data;
        const settlementDate = new Date(future.settlementDate);
        const formattedSettlementDate = format(settlementDate, 'MMM d, yyyy');
        const daysToSettlement = Math.ceil(
          (settlementDate.getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );

        return (
          <>
            <TabsContent value="overview" className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Contract Size</p>
                  <p className="font-medium">
                    {future.contractSize} {future.contractUnit}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Settlement</p>
                  <p className="font-medium">{formattedSettlementDate}</p>
                </div>
              </div>
              <div className="flex items-center justify-center py-2">
                {renderChangeIndicator()}
              </div>
            </TabsContent>
            <TabsContent value="details" className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Days to Settlement
                  </span>
                  <span className="font-medium">{daysToSettlement} days</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Contract Unit
                  </span>
                  <span className="font-medium">{future.contractUnit}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Volume</span>
                  <span className="font-medium">
                    {future.volume.toLocaleString()}
                  </span>
                </div>
              </div>
            </TabsContent>
          </>
        );
      }

      case 'FOREX-PAIR': {
        const forex = data;

        return (
          <>
            <TabsContent value="overview" className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Currency Pair</p>
                  <p className="font-medium">
                    {forex.baseCurrency}/{forex.quoteCurrency}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Exchange Rate</p>
                  <p className="font-medium">{forex.exchangeRate.toFixed(4)}</p>
                </div>
              </div>
              <div className="flex items-center justify-center py-2">
                {renderChangeIndicator()}
              </div>
            </TabsContent>
            <TabsContent value="details" className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Base Currency
                  </span>
                  <span className="font-medium">{forex.baseCurrency}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Quote Currency
                  </span>
                  <span className="font-medium">{forex.quoteCurrency}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Liquidity
                  </span>
                  <span className="font-medium">{forex.liquidity}</span>
                </div>
              </div>
            </TabsContent>
          </>
        );
      }

      default:
        return null;
    }
  };

  const getSecurityIcon = () => {
    switch (data.securityType) {
      case 'STOCK':
        return <CircleDollarSign className="h-5 w-5 text-blue-600" />;
      case 'FUTURE':
        return <Calendar className="h-5 w-5 text-purple-600" />;
      case 'FOREX-PAIR':
        return <ArrowDownUp className="h-5 w-5 text-green-600" />;
      default:
        return <LineChart className="h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getSecurityIcon()}
            <div>
              <CardTitle className="text-xl font-bold">{data.name}</CardTitle>
              <div className="flex items-center gap-2">
                <CardDescription className="text-sm font-medium">
                  {data.ticker}
                </CardDescription>
                <Badge variant="outline" className={getSecurityBadgeColor()}>
                  {data.securityType}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-muted px-2 py-1 rounded-md">
            <DollarSign className="h-4 w-4 text-slate-600 dark:text-white" />
            <span className="font-bold text-lg">{formattedPrice}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          {renderSpecificDetails()}
        </Tabs>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Coins className="h-3 w-3" />
            <span>Vol: {data.volume.toLocaleString()}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
