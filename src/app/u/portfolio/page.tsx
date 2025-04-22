'use client';

import GuardBlock from '@/components/GuardBlock';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useHttpClient } from '@/context/HttpClientContext';
import { Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import useTablePageParams from '@/hooks/useTablePageParams';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/dataTable/DataTable';
import { portfolioColumns } from '@/ui/dataTables/portfolio/portfolioColumns';
import { SecurityHoldingDto } from '@/api/response/securities';
import { getMyPortfolio, getMyProfit, getMyTax } from '@/api/securities';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { transferStocks } from '@/api/stocks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TransferStockDto } from '@/api/request/stocks';
import { z } from 'zod';
import { ALL_STOCK_VISIBILITIES_ } from '@/types/securities';
import { Input } from '@/components/ui/input';
import { UseOptionRequest } from '@/api/request/options';
import { useOption } from '@/api/options';
import { getBankAccounts, getClientAccounts } from '@/api/account';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';

type ModalRef<T> = {
  open: (t: T) => void;
  close: () => void;
};
const transferSchema = z.object({
  stockId: z.string(),
  amount: z.coerce.number(),
  transferTo: z.enum(ALL_STOCK_VISIBILITIES_),
});
const TransferModal = ({ ref }: { ref: Ref<ModalRef<string>> }) => {
  const client = useHttpClient();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<TransferStockDto>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      stockId: '',
      amount: 0,
      transferTo: 'PUBLIC',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (t: TransferStockDto) => transferStocks(client, t),
    onSuccess: () => setIsOpen(false),
  });

  useImperativeHandle(
    ref,
    () => ({
      open: (id) => {
        setIsOpen(true);
        form.setValue('stockId', id);
      },
      close: () => setIsOpen(false),
    }),
    []
  );

  useEffect(() => {
    form.reset();
  }, [open]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={async (newOpen) => {
        if (!newOpen) setIsOpen(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer</DialogTitle>
          <DialogDescription>Transfer funds here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(async (data) => {
              await mutate(data);
            })}
          >
            <FormField
              control={form.control}
              name="stockId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transferTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transfer to</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="rounded-md p-2">
                        <SelectValue placeholder="Select account number" />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_STOCK_VISIBILITIES_.map((vis) => (
                          <SelectItem key={vis} value={vis}>
                            {vis}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse gap-2 sm:flex-row-reverse mt-6">
              <Button type="submit" disabled={isPending}>
                Confirm
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const useOptionSchema = z.object({
  optionId: z.string(),
  accountNumber: z.string(),
});

const UseOptionModal = ({ ref }: { ref: Ref<ModalRef<string>> }) => {
  const client = useHttpClient();
  const auth = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<UseOptionRequest>({
    resolver: zodResolver(useOptionSchema),
    defaultValues: {
      optionId: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (t: UseOptionRequest) => useOption(client, t),
    onSuccess: () => setIsOpen(false),
  });

  const { data: accounts } = useQuery<{ accountNumber: string }[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      if (auth.userType === 'client')
        return (await getClientAccounts(client)).data;
      return (await getBankAccounts(client)).data;
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      open: (id) => {
        setIsOpen(true);
        form.setValue('optionId', id);
      },
      close: () => setIsOpen(false),
    }),
    []
  );

  useEffect(() => {
    form.reset();
  }, [open]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={async (newOpen) => {
        if (!newOpen) setIsOpen(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Use Option</DialogTitle>
          <DialogDescription>Use option here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              await mutate(data);
            })}
          >
            <FormField
              control={form.control}
              name="optionId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="rounded-md p-2">
                        <SelectValue placeholder="Select account number" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts?.map((acc) => (
                          <SelectItem
                            key={acc.accountNumber}
                            value={acc.accountNumber}
                          >
                            {acc.accountNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col-reverse gap-2 sm:flex-row-reverse mt-6">
              <Button type="submit" disabled={isPending}>
                Confirm
              </Button>
              {/* <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose> */}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default function Page() {
  const client = useHttpClient();
  const transferModal = useRef<ModalRef<string>>(null);
  const useModal = useRef<ModalRef<string>>(null);

  const { page, pageSize, setPage, setPageSize } = useTablePageParams(
    'portfolio',
    {
      pageSize: 8,
      page: 0,
    }
  );

  const { isLoading, data: portfolio } = useQuery({
    queryKey: ['portfolio', page, pageSize],
    queryFn: async () => (await getMyPortfolio(client, page, pageSize)).data,
  });
  const { isLoading: profitIsLoading, data: profit } = useQuery({
    queryKey: ['profit'],
    queryFn: async () => (await getMyProfit(client)).data,
  });
  const { isLoading: taxIsLoading, data: tax } = useQuery({
    queryKey: ['tax'],
    queryFn: async () => (await getMyTax(client)).data,
  });
  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [{ title: 'Home', url: '/' }, { title: 'Portfolio' }],
    });
  }, [dispatch]);

  const handleSell = (security: SecurityHoldingDto) => {
    // TODO:
  };

  const handleUse = (security: SecurityHoldingDto) => {
    useModal.current?.open(security.id);
  };

  const handleTransfer = (security: SecurityHoldingDto) => {
    transferModal?.current?.open(security.id);
  };

  return (
    <GuardBlock requiredPrivileges={['ADMIN', 'SUPERVISOR', 'AGENT', 'TRADE']}>
      <TransferModal ref={transferModal} />
      <UseOptionModal ref={useModal} />
      <div className={'p-8'}>
        {profit && tax && (
          <Card className="mb-4 min-w-[400px] w-fit">
            <CardHeader>
              <h2 className="text-2xl font-bold">Profits & Taxes</h2>
            </CardHeader>
            <CardContent className="rounded-lg overflow-hidden">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Profit</span>
                  <span className="font-medium">
                    {profit.amount.toLocaleString()} {profit.currency}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Tax paid for this year
                  </span>
                  <span className="font-medium">
                    {tax.paidTaxThisYear.toLocaleString()} {tax.currency}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Unpaid tax for this month
                  </span>
                  <span
                    className={cn(
                      'font-medium',
                      tax.unpaidTaxThisMonth > 0 ? 'text-red-500' : ''
                    )}
                  >
                    {tax.unpaidTaxThisMonth.toLocaleString()} {tax.currency}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="max-w-full mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-bold">Portfolio</h1>
            <CardDescription>
              This table provides an overview of all the assets under your
              ownership.
            </CardDescription>
          </CardHeader>
          <CardContent className="rounded-lg overflow-hidden">
            <DataTable
              columns={portfolioColumns({
                sell: handleSell,
                transfer: handleTransfer,
                use: handleUse,
              })}
              data={portfolio?.content ?? []}
              isLoading={isLoading}
              pageCount={portfolio?.page.totalPages ?? 0}
              pagination={{ page, pageSize }}
              onPaginationChange={(newPagination) => {
                setPage(newPagination.page);
                setPageSize(newPagination.pageSize);
              }}
            />

            {/* <div className="flex w-full justify-end mt-6">
              <p className={'text-sm text-muted-foreground'}>
                data last updated: {formatDateTime(new Date(dataUpdatedAt))}
              </p>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </GuardBlock>
  );
}
