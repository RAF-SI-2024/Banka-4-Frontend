'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SomePartial } from '@/types/utils';
import { getDirtyValues } from '@/lib/form-utils';
import { CLIENT_PRIVILEGES, CLIENT_PRIVILEGES_ } from '@/types/privileges';
import { ALL_GENDERS_ } from '@/types/gender';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.date({ required_error: 'Date of birth is required' }),
  email: z.string().email('Invalid email address'),
  phoneNumber: z
    .string()
    .regex(/^(\+3816|06)(\d{7,8}|(77|78)\d{5,6})$/, 'Invalid phone number'),
  address: z.string().min(1, 'Address is required'),
  gender: z.enum(ALL_GENDERS_, { required_error: 'Gender is required' }),
  privilege: z.enum(CLIENT_PRIVILEGES_).nullable(),
});

export type ClientFormAction =
  | {
      update: true;
      data: Partial<ClientFormValues>;
    }
  | {
      update: false;
      data: ClientFormValues;
    };

export type ClientFormValues = z.infer<typeof formSchema>;

export interface ClientFormProps {
  onSubmitAction: (values: ClientFormAction) => void;
  isPending: boolean;
  isUpdate: boolean;
  defaultValues: SomePartial<ClientFormValues, 'dateOfBirth'>;
}

export default function ClientForm({
  onSubmitAction,
  isPending,
  defaultValues,
  isUpdate,
}: ClientFormProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onBlur',
  });

  function _onSubmit(data: ClientFormValues) {
    if (isUpdate) {
      onSubmitAction({
        update: true,
        data: getDirtyValues(form.formState.dirtyFields, data),
      });
    } else {
      onSubmitAction({
        update: false,
        data,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(_onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        {/* First Name */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                First Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="John" />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Last Name */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Last Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Doe" />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Date of Birth */}
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Date of Birth <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Popover>
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
                      disabled={{ after: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="john@example.com" />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phone Number <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="+3816..." />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Address <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Street 123, City" />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Gender <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4 pt-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="MALE" id="r1" />
                    <Label htmlFor="r1">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FEMALE" id="r2" />
                    <Label htmlFor="r2">Female</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Privileges */}
        <FormField
          control={form.control}
          name="privilege"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Select
                onValueChange={(value) =>
                  field.onChange(value === 'none' ? undefined : value)
                }
                value={field.value || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a privilege" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'none'}>None</SelectItem>
                  {CLIENT_PRIVILEGES.map((privilege) => (
                    <SelectItem key={privilege} value={privilege}>
                      {privilege}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.value && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => field.onChange(null)}
                >
                  Clear
                </Button>
              )}
            </div>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end w-full col-span-2">
          <Button
            disabled={isPending}
            type="submit"
            className="px-3 py-1 text-sm"
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
