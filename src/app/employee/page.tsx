'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useHttpClient } from '@/context/HttpClientContext';
import { Loader2, Search } from 'lucide-react';
import { PaginationSection } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import GuardBlock from '@/components/GuardBlock';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { searchEmployees } from '@/api/employee';
import { EmployeeResponseDto } from '@/api/response/employee';

const EmployeeOverviewPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchFilters, setSearchFilters] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
  });
  const router = useRouter();
  const rowsPerPage = 8;

  const queryClient = useQueryClient();
  const client = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ['employees', currentPage, rowsPerPage],
    queryFn: async () => {
      const response = await searchEmployees(
        client,
        searchFilters,
        rowsPerPage,
        currentPage
      );
      return response.data;
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    queryClient.invalidateQueries({
      queryKey: ['employees', currentPage, rowsPerPage],
    });
    setCurrentPage(1);
  };

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
    <GuardBlock requiredPrivileges={['ADMIN']}>
      <div className="p-8">
        <Card className="max-w-[900px] mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-bold">Employees Overview</h1>
            <p className="text-sm text-zinc-500">
              This table provides a clear and organized overview of key employee
              details for quick reference and easy access.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex mb-4 space-x-2"
            >
              <Input
                type="text"
                name="firstName"
                placeholder="filter by first name"
                value={searchFilters.firstName}
                onChange={handleInputChange}
              />
              <Input
                type="text"
                name="lastName"
                placeholder="filter by last name"
                value={searchFilters.lastName}
                onChange={handleInputChange}
              />
              <Input
                type="text"
                name="email"
                placeholder="filter by email"
                value={searchFilters.email}
                onChange={handleInputChange}
              />
              <Input
                type="text"
                name="position"
                placeholder="filter by position"
                value={searchFilters.position}
                onChange={handleInputChange}
              />
              <Button type={'submit'} onClick={handleSearch}>
                Search
                <Search className="w-4 h-4 mr-1" />
              </Button>
            </form>
          </CardHeader>
          <CardContent className="rounded-lg overflow-hidden">
            {isLoading ? (
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
                    {data === undefined || data.empty ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center p-6 text-muted-foreground"
                        >
                          There are currently no employees
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.content.map((employee: EmployeeResponseDto) => (
                        <TableRow
                          className={'cursor-pointer'}
                          key={employee.id}
                          onClick={() =>
                            router.push(`/employee/${employee.id}/edit`)
                          }
                        >
                          <TableCell>{employee.firstName}</TableCell>
                          <TableCell>{employee.lastName}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.phone}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>
                            {employee.active ? 'Yes' : 'No'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                {data !== undefined && (
                  <PaginationSection
                    pageCount={data.totalPages}
                    currentPage={currentPage}
                    onChangePage={(page) => {
                      setCurrentPage(page);
                    }}
                    resultsLength={data.totalElements}
                    pageSize={rowsPerPage}
                  ></PaginationSection>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </GuardBlock>
  );
};

export default EmployeeOverviewPage;
