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
import { Switch } from '@/components/ui/switch';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SomePartial } from '@/types/utils';

import { EMPLOYEE_PRIVILEGES, EMPLOYEE_PRIVILEGES_ } from '@/types/privileges';
import { getDirtyValues } from '@/lib/form-utils';
import { ALL_GENDERS_ } from '@/types/gender';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.date(),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1),
  phoneNumber: z
    .string()
    .regex(/^(\+3816|06)(\d{7,8}|(77|78)\d{5,6})$/, 'Invalid phone number'),
  position: z.string().min(1),
  username: z.string().min(1),
  department: z.string().min(1),
  gender: z.enum(ALL_GENDERS_),
  active: z.boolean(),
  privilege: z.enum(EMPLOYEE_PRIVILEGES_).nullable(),
});

export type EmployeeFormAction =
  | {
      update: true;
      data: Partial<EmployeeFormValues>;
    }
  | {
      update: false;
      data: EmployeeFormValues;
    };

export type EmployeeFormValues = z.infer<typeof formSchema>;

export interface EmployeeFormProps {
  onSubmit: (values: EmployeeFormAction) => void;
  isPending: boolean;
  isUpdate: boolean;
  defaultValues: SomePartial<EmployeeFormValues, 'dateOfBirth'>;
}

export default function EmployeeForm({
  onSubmit,
  isPending,
  defaultValues,
  isUpdate,
}: EmployeeFormProps) {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function _onSubmit(data: EmployeeFormValues) {
    if (isUpdate) {
      onSubmit({
        update: true,
        data: getDirtyValues(form.formState.dirtyFields, data),
      });
    } else {
      onSubmit({
        update: false,
        data: data,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(_onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>
                First Name <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="John" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>
                Last Name <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Doe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>
                Date of Birth <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id={'dateOfBirth'}
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>
                Email <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="john@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>
                Address <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Trg Republike 5" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>
                Phone Number <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="+381" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>
                Position <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Manager" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>
                Username <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="jdoe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>
                Department <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Finance" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>
                Gender <span className="text-red-500 text-xl">*</span>
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
              <FormMessage />
            </FormItem>
          )}
        />
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
                  {EMPLOYEE_PRIVILEGES.map((privilege) => (
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
        <div className="flex items-center col-span-2 justify-between w-full">
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      onCheckedChange={field.onChange}
                      checked={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Label htmlFor="activeEmployee">Is this employee active?</Label>
          </div>

          <Button disabled={isPending} type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
