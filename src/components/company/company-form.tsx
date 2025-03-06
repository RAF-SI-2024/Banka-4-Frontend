'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Combobox } from '@/components/ui/combobox';
import { activityCodes } from '@/lib/activity-codes';

const formSchema = z.object({
  name: z.string().nonempty(),
  tin: z.string().nonempty(),
  crn: z.string().nonempty(),
  address: z.string().nonempty(),
  activityCode: z.string().nonempty(),
});

export type CompanyFormData = z.infer<typeof formSchema>;

export interface CompanyFormProps {
  isPending: boolean;
  onSubmitAction: (values: CompanyFormData) => void;
}

export default function CompanyForm({
  onSubmitAction,
  isPending = true,
}: CompanyFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      tin: '',
      crn: '',
      address: '',
      activityCode: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
          onSubmitAction(data);
        })}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input type="text" placeholder="Company Name" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                TIN <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Tax Identification Number"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="crn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                CRN <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Company Registration Number"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Address <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input type="text" placeholder="Company Address" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activityCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Activity Code <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Combobox
                  options={activityCodes}
                  value={field.value}
                  onChange={field.onChange}
                  getOptionValue={(option) => option.code}
                  getOptionLabel={(option) =>
                    `${option.code} ${option.branch.length > 30 ? option.branch.slice(0, 30) + '...' : option.branch}`
                  }
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="default"
            className="font-normal"
            disabled={isPending}
          >
            Add Company
          </Button>
        </div>
      </form>
    </Form>
  );
}
