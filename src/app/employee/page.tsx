'use client';

import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Search } from 'lucide-react';

import { PaginationSection } from '@/components/ui/pagination';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';

import { mockEmployees } from './mockDataOverview';

import { useBreadcrumb } from '@/context/BreadcrumbContext';

const employeeSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone_number: z.string(),
  position: z.string(),
  active: z.boolean(),
});

type Employee = z.infer<typeof employeeSchema>;

const EmployeeOverviewPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState({
    first_name: '',
    last_name: '',
    email: '',
    position: '',
  });
  const rowsPerPage = 8;

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        // temelj za API poziv, do veceras umesto njega samo koristiti mockData.ts 10:13 24.02.2025

        // const res = await fetch('/employee');
        // const data = await res.json();
        // const parsedData = z.array(employeeSchema).parse(data);
        // setEmployees(parsedData);

        const parsedData = z.array(employeeSchema).parse(mockEmployees);
        setEmployees(parsedData);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [currentPage, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    // Call your backend API with the filters here
  };

  // Calculate paginated data
  const indexOfLastEmployee = currentPage * rowsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - rowsPerPage;
  const currentEmployees = employees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  // Calculate total pages
  const totalPages = Math.ceil(employees.length / rowsPerPage);

  // u items-u se nalazi sta ce biti prikazano kao breadcrumb,
  // title je sta se prikazuje a url je gde vodi,
  //moraju da budu poredjani u redosledu kako ce se prikazivati
  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/' },
        { title: 'Employees', url: '/employee' },
        { title: 'Overview' },
      ],
    });
  }, [dispatch]);

  return (
    <div className="p-8">
      <Card className="max-w-[900px] mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">Employees Overview</h1>
          <p className="text-sm text-zinc-500">
            This table provides a clear and organized overview of key employee
            details for quick reference and easy access.
          </p>
          <div className="flex mb-4 space-x-2">
            <Input
              type="text"
              name="first_name"
              placeholder="filter by first name"
              value={filters.first_name}
              onChange={handleFilterChange}
            />
            <Input
              type="text"
              name="last_name"
              placeholder="filter by last name"
              value={filters.last_name}
              onChange={handleFilterChange}
            />
            <Input
              type="text"
              name="email"
              placeholder="filter by email"
              value={filters.email}
              onChange={handleFilterChange}
            />
            <Input
              type="text"
              name="position"
              placeholder="filter by position"
              value={filters.position}
              onChange={handleFilterChange}
            />
            <Button onClick={handleSearch}>
              Search
              <Search className="w-4 h-4 mr-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Active</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {currentEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center p-6 text-zinc-500"
                      >
                        There are currently no employees
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>{employee.first_name}</TableCell>
                        <TableCell>{employee.last_name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.phone_number}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.active ? 'Yes' : 'No'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <PaginationSection
                pageCount={totalPages}
                currentPage={currentPage}
                onChangePage={setCurrentPage}
                resultsLength={employees.length}
                pageSize={rowsPerPage}
              ></PaginationSection>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeOverviewPage;
