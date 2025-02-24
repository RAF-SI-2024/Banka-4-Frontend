'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function NewEmployeePage() {
  const [date, setDate] = React.useState<Date>();

  const formSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.date({
      required_error: 'Date of birth is required',
    }),
    email: z.string().email('Invalid email address'),
    address: z.string().min(1, 'Address is required'),
    phoneNumber: z
      .string()
      .regex(/^\d+$/, 'Phone number must contain only numbers'),
    position: z.string().min(1, 'Position is required'),
    username: z.string().min(1, 'Username is required'),
    department: z.string().min(1, 'Department is required'),
    gender: z.enum(['male', 'female'], {
      required_error: 'Gender is required',
    }),
    isActive: z.boolean().default(true),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: undefined,
      email: '',
      address: '',
      phoneNumber: '',
      position: '',
      username: '',
      department: '',
      gender: undefined,
      isActive: true,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div>
      <Breadcrumb
        className="my-4 flex justify-left gap-2 ml-4"
        style={{ width: '1184px', height: '28px' }}
      >
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/employees">Employees</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-center items-center pt-16">
        <Card className="w-[800px]">
          <CardHeader>
            <CardTitle>Add New Employee</CardTitle>
            <CardDescription>
              Enter the employee’s details to create their account and grant
              them access to the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-4"
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>
                        First Name{' '}
                        <span className="text-red-500 text-xl">•</span>
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
                        Last Name{' '}
                        <span className="text-red-500 text-xl">•</span>
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
                        Date of Birth{' '}
                        <span className="text-red-500 text-xl">•</span>
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !date && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? (
                                format(date, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(selectedDate) => {
                                setDate(selectedDate);
                                field.onChange(selectedDate);
                              }}
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
                        Email <span className="text-red-500 text-xl">•</span>
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
                        Address <span className="text-red-500 text-xl">•</span>
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
                        Phone Number{' '}
                        <span className="text-red-500 text-xl">•</span>
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
                        Position <span className="text-red-500 text-xl">•</span>
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
                  name="username"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>
                        Username <span className="text-red-500 text-xl">•</span>
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
                        Department{' '}
                        <span className="text-red-500 text-xl">• </span>
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
                        Gender <span className="text-red-500 text-xl">•</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4 pt-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="r1" />
                            <Label htmlFor="r1">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="r2" />
                            <Label htmlFor="r2">Female</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="activeEmployee"
                checked={form.watch('isActive')}
                onCheckedChange={(checked) =>
                  form.setValue('isActive', checked)
                }
              />
              <Label htmlFor="activeEmployee">Is this employee active?</Label>
            </div>

            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
