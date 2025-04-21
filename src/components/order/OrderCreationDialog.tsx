import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CreateOrderRequest, OrderPreviewRequest } from '@/api/request/orders';
import { OrderPreviewDto } from '@/api/response/orders';
import { ORDER_TYPES, ORDER_TYPES_, OrderDirection } from '@/types/orders';
import { Switch } from '@/components/ui/switch';
import { orderTypeToHumanReadable } from '@/lib/order-utils';
import { Currency } from '@/types/currency';
import { MonetaryAmount } from '@/api/response/listing';
import { formatAccountNumber } from '@/lib/account-utils';
import { BaseAccountDto } from '@/api/response/account';

const orderFormSchema = z
  .object({
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    orderType: z.enum(ORDER_TYPES_, {
      required_error: 'Order type is required',
    }),
    limitValue: z.coerce.number().optional(),
    stopValue: z.coerce.number().optional(),
    allOrNothing: z.boolean().default(false),
    margin: z.boolean().default(false),
    accountNumber: z.string(),
  })
  .refine(
    (data) => {
      return !(
        (data.orderType === 'LIMIT' || data.orderType === 'STOP_LIMIT') &&
        data.limitValue === undefined
      );
    },
    { message: 'Enter limit value', path: ['limitValue'] }
  )
  .refine(
    (data) => {
      return !(
        (data.orderType === 'STOP' || data.orderType === 'STOP_LIMIT') &&
        data.stopValue === undefined
      );
    },
    { message: 'Enter stop value', path: ['stopValue'] }
  );

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface OrderCreationDialogProps {
  open: boolean;
  direction: OrderDirection;
  accounts: BaseAccountDto[];
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
      orderType: 'MARKET',
      allOrNothing: false,
      margin: false,
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
    const selectedAccount = accounts.find(
      (a) => a.accountNumber === data.accountNumber
    );
    if (!selectedAccount) return;

    const previewRequest: OrderPreviewRequest = {
      assetId,
      direction,
      quantity: data.quantity,
      allOrNothing: data.allOrNothing,
      margin: data.margin,
      ..._makeStopAndLimitValue(data, selectedAccount.currency),
    };

    setLoading(true);
    const previewResponse = await onPreviewRequested(previewRequest);
    setPreviewData(previewResponse);
    setSubmittedData(data);
    setStep(2);
    setLoading(false);
  };

  const handleConfirmOrder = async () => {
    if (!submittedData) return;
    const selectedAccount = accounts.find(
      (a) => a.accountNumber === submittedData.accountNumber
    );
    if (!selectedAccount) return;

    const createOrderRequest: CreateOrderRequest = {
      assetId: assetId,
      direction: direction,
      quantity: submittedData.quantity,
      ..._makeStopAndLimitValue(submittedData, selectedAccount.currency),
      allOrNothing: submittedData.allOrNothing,
      margin: submittedData.margin,
      accountNumber: selectedAccount.accountNumber,
    };

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
                            {ORDER_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {orderTypeToHumanReadable(type)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div
                  className={
                    form.watch('orderType') === 'LIMIT' ||
                    form.watch('orderType') === 'STOP_LIMIT'
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
                    form.watch('orderType') === 'STOP' ||
                    form.watch('orderType') === 'STOP_LIMIT'
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
                  name={'accountNumber'}
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
                              return (
                                <SelectItem
                                  key={acc.accountNumber}
                                  value={acc.accountNumber}
                                >
                                  {`${formatAccountNumber(acc.accountNumber)} - ${acc.availableBalance.toLocaleString()} ${acc.currency}`}
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
        {step === 2 && previewData && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                <strong>Order Type:</strong> {previewData.orderType}
              </p>
              <p>
                <strong>Approximate Price:</strong>{' '}
                {previewData.approximatePrice.toLocaleString()}{' '}
                {accounts.find(
                  (acc) =>
                    submittedData?.accountNumber !== undefined &&
                    acc.accountNumber === submittedData?.accountNumber
                )?.currency ?? ''}
              </p>
              <p>
                <strong>Quantity:</strong>{' '}
                {previewData.quantity.toLocaleString()}
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

function _makeStopAndLimitValue(
  data: OrderFormValues,
  currency: Currency
): {
  limitValue?: MonetaryAmount;
  stopValue?: MonetaryAmount;
} {
  return {
    limitValue:
      (data.orderType === 'LIMIT' || data.orderType === 'STOP_LIMIT') &&
      data.limitValue !== undefined
        ? {
            amount: data.limitValue,
            currency: currency,
          }
        : undefined,
    stopValue:
      (data.orderType === 'STOP' || data.orderType === 'STOP_LIMIT') &&
      data.stopValue !== undefined
        ? {
            amount: data.stopValue,
            currency: currency,
          }
        : undefined,
  };
}

export default OrderCreationDialog;
