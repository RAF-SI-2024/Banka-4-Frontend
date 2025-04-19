import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SomePartial } from '@/types/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getDirtyValues } from '@/lib/form-utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  pricePerStock: z.coerce.number(),
  premium: z.coerce.number(),
  amount: z.coerce.number(),
  settlementDate: z.date(),
});

export type OfferFormValues = z.infer<typeof formSchema>;

export type OfferFormAction =
  | { update: true; data: Partial<OfferFormValues> }
  | { update: false; data: OfferFormValues };

export interface OfferFormProps {
  isUpdate: boolean;
  isPending: boolean;
  defaultValues: SomePartial<OfferFormValues, 'settlementDate'>;
  onSubmit: (action: OfferFormAction) => void;
}

export default function OfferForm(props: OfferFormProps) {
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues,
  });

  function onSubmitAction(data: OfferFormValues) {
    if (props.isUpdate) {
      return props.onSubmit({
        update: true,
        data: getDirtyValues(form.formState.dirtyFields, data),
      });
    } else {
      return props.onSubmit({ update: false, data });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          onSubmitAction(data);
        })}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="pricePerStock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Price per Stock <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="Price per stock" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="premium"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Premium <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter premium" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Amount <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter amount" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settlementDate"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>
                Settlement Date <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="default"
            className="font-normal"
            disabled={props.isPending}
          >
            Make an Offer
          </Button>
        </div>
      </form>
    </Form>
  );
}
