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

const orderFormSchema = z
  .object({
    quantity: z
      .number({ invalid_type_error: 'Quantity is required' })
      .min(1, 'Quantity must be at least 1'),
    orderType: z.enum(['Market', 'Limit', 'Stop', 'Stop-Limit'], {
      required_error: 'Order type is required',
    }),
    limitValue: z.number().optional(),
    stopValue: z.number().optional(),
    allOrNothing: z.boolean().default(false),
    margin: z.boolean().default(false),
    accountId: z.string().nonempty('Select an account'),
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
    const selectedAccount = accounts.find((acc) => acc.id === data.accountId);
    if (!selectedAccount) {
      return;
    }
    const previewRequest: OrderPreviewRequest = {
      assetId,
      quantity: data.quantity,
      limitValue:
        data.limitValue !== undefined
          ? {
              amount: data.limitValue,
              currency: selectedAccount.currency
                .code as MonetaryAmount['currency'],
            }
          : undefined,
      stopValue:
        data.stopValue !== undefined
          ? {
              amount: data.stopValue,
              currency: selectedAccount.currency
                .code as MonetaryAmount['currency'],
            }
          : undefined,
      allOrNothing: data.allOrNothing,
      margin: data.margin,
      accountId: data.accountId,
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
    const selectedAccount = accounts.find(
      (acc) => acc.id === submittedData.accountId
    );
    if (!selectedAccount) return;
    const createOrderRequest: CreateOrderRequest = {
      assetId,
      direction,
      quantity: submittedData.quantity,
      limitValue:
        submittedData.limitValue !== undefined
          ? {
              amount: submittedData.limitValue,
              currency: selectedAccount.currency
                .code as MonetaryAmount['currency'],
            }
          : undefined,
      stopValue:
        submittedData.stopValue !== undefined
          ? {
              amount: submittedData.stopValue,
              currency: selectedAccount.currency
                .code as MonetaryAmount['currency'],
            }
          : undefined,
      allOrNothing: submittedData.allOrNothing,
      margin: submittedData.margin,
      accountId: submittedData.accountId,
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
                {(form.watch('orderType') === 'Limit' ||
                  form.watch('orderType') === 'Stop-Limit') && (
                  <FormField
                    control={form.control}
                    name="limitValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limit Value</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {(form.watch('orderType') === 'Stop' ||
                  form.watch('orderType') === 'Stop-Limit') && (
                  <FormField
                    control={form.control}
                    name="stopValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stop Value</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="allOrNothing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>All or Nothing</FormLabel>
                      <FormControl>
                        <select
                          onChange={(e) =>
                            field.onChange(e.target.value === 'true')
                          }
                          onBlur={field.onBlur}
                          value={field.value ? 'true' : 'false'}
                          name={field.name}
                          ref={field.ref}
                          className="input"
                        >
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="margin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Margin</FormLabel>
                      <FormControl>
                        <select
                          onChange={(e) =>
                            field.onChange(e.target.value === 'true')
                          }
                          onBlur={field.onBlur}
                          value={field.value ? 'true' : 'false'}
                          name={field.name}
                          ref={field.ref}
                          className="input"
                        >
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an account" />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map((acc) => (
                              <SelectItem key={acc.id} value={acc.id}>
                                {acc.accountNumber} - {acc.currency.code}
                              </SelectItem>
                            ))}
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
                <strong>Asset ID:</strong> {assetId}
              </p>
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
                <strong>Approximate Price (preview):</strong>{' '}
                {previewData.approximatePrice}
              </p>
              <p>
                <strong>Quantity (preview):</strong> {previewData.quantity}
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
