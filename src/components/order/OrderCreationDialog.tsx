import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { OrderPreviewRequest, CreateOrderRequest } from '@/api/request/orders';
import { OrderPreviewDto } from '@/api/response/orders';
import { OrderDirection } from '@/types/orders';
import { AccountDto } from '@/api/response/account';
import { MonetaryAmount } from '@/api/response/listing';
import { useMe } from '@/hooks/use-me';
import { Switch } from '@/components/ui/switch';

const orderFormSchema = z
  .object({
    quantity: z
      .number({ invalid_type_error: 'Quantity is required' })
      .min(1, 'Quantity must be at least 1'),
    orderType: z.enum(['Market', 'Limit', 'Stop', 'Stop-Limit'], {
      required_error: 'Order type is required',
    }),
    limitValue: z.coerce.number().optional(),
    stopValue: z.coerce.number().optional(),
    allOrNothing: z.boolean().default(false),
    margin: z.boolean().default(false),
    accountId: z.string().optional(),
    accountNumber: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        (data.orderType === 'Limit' || data.orderType === 'Stop-Limit') &&
        data.limitValue === undefined
      ) {
        return false;
      }
      return true;
    },
    { message: 'Enter limit value', path: ['limitValue'] }
  )
  .refine((data) => Boolean(data.accountId) !== Boolean(data.accountNumber), {
    message: 'Select an account',
    path: ['accountId'], // you can point at either
  })
  .refine(
    (data) => {
      if (
        (data.orderType === 'Stop' || data.orderType === 'Stop-Limit') &&
        data.stopValue === undefined
      ) {
        return false;
      }
      return true;
    },
    { message: 'Enter stop value', path: ['stopValue'] }
  );

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface OrderCreationDialogProps {
  open: boolean;
  direction: OrderDirection;
  accounts: AccountDto[];
  assetId: string;
  onPreviewRequested: (
    request: OrderPreviewRequest
  ) => Promise<OrderPreviewDto>;
  onOrderConfirmed: (orderRequest: CreateOrderRequest) => Promise<void>;
  onClose: () => void;
}

export const OrderCreationDialog: React.FC<OrderCreationDialogProps> = ({
  open,
  direction,
  accounts,
  assetId,
  onPreviewRequested,
  onOrderConfirmed,
  onClose,
}) => {
  const me = useMe();
  const [step, setStep] = useState<1 | 2>(1);
  const [previewData, setPreviewData] = useState<OrderPreviewDto | null>(null);
  const [submittedData, setSubmittedData] = useState<OrderFormValues | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      quantity: 1,
      orderType: 'Market',
      allOrNothing: false,
      margin: false,
      accountId: '',
      accountNumber: '',
      limitValue: 0,
      stopValue: 0,
    },
  });

  const handleCancel = () => {
    setStep(1);
    setPreviewData(null);
    setSubmittedData(null);
    form.reset();
    onClose();
  };

  const onFormSubmit = async (data: OrderFormValues) => {
    const key =
      me.state === 'logged-in' && me.type === 'employee'
        ? data.accountNumber
        : data.accountId;
    const selectedAccount = accounts.find((acc) =>
      me.state === 'logged-in' && me.type === 'employee'
        ? acc.accountNumber === key
        : acc.id === key
    );
    if (!selectedAccount) return;

    const previewRequest: OrderPreviewRequest = {
      assetId,
      direction,
      quantity: data.quantity,
      allOrNothing: data.allOrNothing,
      margin: data.margin,

      limitValue: {
        amount:
          data.orderType === 'Limit' || data.orderType === 'Stop-Limit'
            ? data.limitValue!
            : 0,
        currency: selectedAccount.currency.code as MonetaryAmount['currency'],
      },

      stopValue: {
        amount:
          data.orderType === 'Stop' || data.orderType === 'Stop-Limit'
            ? data.stopValue!
            : 0,
        currency: selectedAccount.currency.code as MonetaryAmount['currency'],
      },
    };

    try {
      setLoading(true);
      const previewResponse = await onPreviewRequested(previewRequest);
      setPreviewData(previewResponse);
      setSubmittedData(data);
      setStep(2);
    } catch (error) {
      console.error('Error fetching preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!submittedData) return;
    const key =
      me.state === 'logged-in' && me.type === 'employee'
        ? submittedData.accountNumber
        : submittedData.accountId;
    const selectedAccount = accounts.find((acc) =>
      me.state === 'logged-in' && me.type === 'employee'
        ? acc.accountNumber === key
        : acc.id === key
    );
    if (!selectedAccount) return;

    const createOrderRequest: CreateOrderRequest = {
      assetId,
      direction,
      quantity: submittedData.quantity,
      allOrNothing: submittedData.allOrNothing,
      margin: submittedData.margin,
      ...(me.state === 'logged-in' && me.type === 'employee'
        ? { accountNumber: submittedData.accountNumber }
        : { accountId: submittedData.accountId }),
      ...(submittedData.limitValue !== undefined && {
        limitValue: {
          amount: submittedData.limitValue ?? 0,
          currency: selectedAccount.currency.code as MonetaryAmount['currency'],
        },
      }),
      ...(submittedData.stopValue !== undefined && {
        stopValue: {
          amount: submittedData.stopValue ?? 0,
          currency: selectedAccount.currency.code as MonetaryAmount['currency'],
        },
      }),
    } as CreateOrderRequest;

    try {
      setLoading(true);
      await onOrderConfirmed(createOrderRequest);
      handleCancel();
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setStep(1);
      setPreviewData(null);
      setSubmittedData(null);
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent>
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Create Order</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onFormSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="orderType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select order type" />
                          </SelectTrigger>
                          <SelectContent>
                            {['Market', 'Limit', 'Stop', 'Stop-Limit'].map(
                              (type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div
                  className={
                    form.watch('orderType') === 'Limit' ||
                    form.watch('orderType') === 'Stop-Limit'
                      ? ''
                      : 'hidden'
                  }
                >
                  <FormField
                    control={form.control}
                    name="limitValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limit Value</FormLabel>
                        <FormControl>
                          <Input type="number" step="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div
                  className={
                    form.watch('orderType') === 'Stop' ||
                    form.watch('orderType') === 'Stop-Limit'
                      ? ''
                      : 'hidden'
                  }
                >
                  <FormField
                    control={form.control}
                    name="stopValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stop Value</FormLabel>
                        <FormControl>
                          <Input type="number" step="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="allOrNothing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <FormLabel className="mb-0">All or Nothing</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="margin"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <FormLabel className="mb-0">Margin</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={
                    me.state === 'logged-in' && me.type === 'employee'
                      ? 'accountNumber'
                      : 'accountId'
                  }
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={String(field.value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an account" />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map((acc) => {
                              const val =
                                me.state === 'logged-in' &&
                                me.type === 'employee'
                                  ? acc.accountNumber
                                  : acc.id;
                              const label =
                                me.state === 'logged-in' &&
                                me.type === 'employee'
                                  ? `${acc.accountNumber} – ${acc.currency}`
                                  : `${acc.accountNumber} – ${acc.currency.code}`;
                              return (
                                <SelectItem key={val} value={val}>
                                  {label}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Loading…' : 'Preview'}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
        {step === 2 && previewData && submittedData && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                <strong>Quantity:</strong> {submittedData.quantity}
              </p>
              <p>
                <strong>Order Type:</strong> {submittedData.orderType}
              </p>
              {(submittedData.orderType === 'Limit' ||
                submittedData.orderType === 'Stop-Limit') && (
                <p>
                  <strong>Limit Value:</strong> {submittedData.limitValue}
                </p>
              )}
              {(submittedData.orderType === 'Stop' ||
                submittedData.orderType === 'Stop-Limit') && (
                <p>
                  <strong>Stop Value:</strong> {submittedData.stopValue}
                </p>
              )}
              <p>
                <strong>Approximate Price:</strong>{' '}
                {previewData.approximatePrice}
              </p>
              <p>
                <strong>Quantity:</strong> {previewData.quantity}
              </p>
            </div>
            <DialogFooter className="flex justify-end space-x-2 mt-4">
              <Button variant="destructive" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleConfirmOrder} disabled={loading}>
                {loading ? 'Processing…' : 'Confirm'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderCreationDialog;
