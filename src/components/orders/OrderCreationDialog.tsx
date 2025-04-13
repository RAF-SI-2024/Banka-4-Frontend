'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { OrderDirection, ORDER_DIRECTIONS, ORDER_TYPES } from '@/types/orders';
import { OrderPreviewRequest } from '@/api/request/orders';
import { OrderPreviewDto } from '@/api/response/orders';
import { MonetaryAmount } from '@/api/response/listing';
import { ORDER_DIRECTIONS_ } from '@/types/orders';
import { ORDER_TYPES_ } from '@/types/orders';
import { ALL_CURRENCIES_ } from '@/types/currency';

const orderFormSchema = z.object({
  direction: z.enum(ORDER_DIRECTIONS_),
  orderType: z.enum(ORDER_TYPES_),
  currency: z.enum(ALL_CURRENCIES_),
  assetId: z.string().min(1, 'Asset is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  limitValue: z.coerce.number().min(0, 'Limit must be 0 or greater'),
  stopValue: z.coerce.number().min(0, 'Stop must be 0 or greater'),
  allOrNothing: z.boolean(),
  margin: z.boolean(),
  accountId: z.string().min(1, 'Account is required'),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

interface Props {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  accounts: Array<{ id: string; name: string }>;
  onPreview: (req: OrderPreviewRequest) => Promise<OrderPreviewDto>;
  onConfirm: (req: OrderFormValues) => void;
}

export default function OrderCreationDialog({
  open,
  onOpenChange,
  accounts,
  onPreview,
  onConfirm,
}: Props) {
  const [showPreview, setShowPreview] = React.useState(false);
  const [previewData, setPreviewData] = React.useState<OrderPreviewDto | null>(
    null
  );
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      allOrNothing: false,
      margin: false,
    },
  });

  const handleSubmit = async (values: OrderFormValues) => {
    const req: OrderPreviewRequest = {
      ...values,
      limitValue: {
        amount: values.limitValue,
        currency: values.currency,
      },
      stopValue: {
        amount: values.stopValue,
        currency: values.currency,
      },
    };
    const preview = await onPreview(req);
    setPreviewData(preview);
    setShowPreview(true);
  };

  const handleConfirm = () => {
    if (!previewData) return;
    const values = form.getValues();
    onConfirm(values);
    setShowPreview(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Order</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid gap-4"
            >
              <FormField
                control={form.control}
                name="assetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ORDER_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="direction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Direction</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ORDER_DIRECTIONS.map((dir) => (
                          <SelectItem key={dir} value={dir}>
                            {dir}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>
                            {acc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Preview</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preview Order</DialogTitle>
          </DialogHeader>
          {previewData ? (
            <div className="space-y-4">
              <p>
                <b>Type:</b> {previewData.orderType}
              </p>
              <p>
                <b>Quantity:</b> {previewData.quantity}
              </p>
              <p>
                <b>Approx. Price:</b> {previewData.approximatePrice} RSD
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowPreview(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirm}>Confirm Order</Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading preview...</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
