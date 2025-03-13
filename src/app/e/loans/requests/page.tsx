'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Row } from '@tanstack/react-table';
import { LoanRequestDto } from '@/api/response/loan';
import { useHttpClient } from '@/context/HttpClientContext';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import GuardBlock from '@/components/GuardBlock';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/dataTable/DataTable';
import useTablePageParams from '@/hooks/useTablePageParams';
import FilterBar, { FilterDefinition } from '@/components/filters/FilterBar';
import {
  approveLoan,
  LoanFilters,
  rejectLoan,
  searchAllLoanRequests,
} from '@/api/loans';
import { loanRequestColumns } from '@/ui/dataTables/loans/loansOverviewColums';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ALL_LOAN_TYPES, LoanType } from '@/types/loan';

interface LoanFilter {
  loanType?: LoanType;
  accountNumber?: string;
}

const loanFilterColumns: Record<keyof LoanFilter, FilterDefinition> = {
  loanType: {
    filterType: 'enum',
    placeholder: 'Enter loan type',
    options: ALL_LOAN_TYPES,
    optionToString: (option) => option,
  },
  accountNumber: {
    filterType: 'string',
    placeholder: 'Enter account number',
  },
};

const LoansRequestsPage: React.FC = () => {
  const { page, pageSize, setPage, setPageSize } = useTablePageParams(
    'loan-requests',
    { pageSize: 8, page: 0 }
  );

  const [searchFilter, setSearchFilter] = useState<LoanFilters>({
    loanType: undefined,
    accountNumber: '',
  });

  const client = useHttpClient();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['loan-requests', page, pageSize, searchFilter],
    queryFn: async () =>
      (await searchAllLoanRequests(client, { ...searchFilter }, page, pageSize))
        .data,
  });

  const approveMutation = useMutation({
    mutationFn: (loanNumber: number) => approveLoan(client, loanNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan-requests'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (loanNumber: number) => rejectLoan(client, loanNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan-requests'] });
    },
  });

  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/e' },
        { title: 'Loans', url: '/e/loans' },
        { title: 'Requests' },
      ],
    });
  }, [dispatch]);

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<number | null>(null);

  const handleApprove = (loanNumber: number) => {
    setSelectedLoan(loanNumber);
    setApproveDialogOpen(true);
  };

  const handleReject = (loanNumber: number) => {
    setSelectedLoan(loanNumber);
    setRejectDialogOpen(true);
  };

  const columnsWithActions = [
    ...loanRequestColumns,
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: Row<LoanRequestDto> }) => (
        <div className="flex gap-2">
          <Button onClick={() => handleApprove(row.original.loanNumber)}>
            Approve
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleReject(row.original.loanNumber)}
          >
            Deny
          </Button>
        </div>
      ),
    },
  ];

  return (
    <GuardBlock requiredUserType="employee">
      <div className="p-8">
        <Card className="max-w-[900px] mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-bold">Loan Requests</h1>
            <CardDescription>
              Review and manage loan requests that are currently in processing
              status.
            </CardDescription>
            <FilterBar<LoanFilter, typeof loanFilterColumns>
              onSubmit={(filter) => {
                setPage(0);
                setSearchFilter(filter);
              }}
              filter={searchFilter}
              columns={loanFilterColumns}
            />
          </CardHeader>
          <CardContent className="rounded-lg overflow-hidden">
            <DataTable
              columns={columnsWithActions}
              data={data?.content ?? []}
              isLoading={isLoading}
              pageCount={data?.page.totalPages ?? 0}
              pagination={{ page, pageSize }}
              onPaginationChange={(newPagination) => {
                setPage(newPagination.page);
                setPageSize(newPagination.pageSize);
              }}
            />
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={approveDialogOpen}
        title="Confirm Approval"
        description="Are you sure you want to approve this loan?"
        onConfirm={async () => {
          if (selectedLoan !== null) {
            await approveMutation.mutateAsync(selectedLoan);
            setApproveDialogOpen(false);
          }
        }}
        onCancel={() => setApproveDialogOpen(false)}
      />

      <ConfirmDialog
        open={rejectDialogOpen}
        title="Confirm Denial"
        description="Are you sure you want to deny this loan?"
        buttonText="Deny"
        onConfirm={async () => {
          if (selectedLoan !== null) {
            await rejectMutation.mutateAsync(selectedLoan);
            setRejectDialogOpen(false);
          }
        }}
        onCancel={() => setRejectDialogOpen(false)}
      />
    </GuardBlock>
  );
};

export default LoansRequestsPage;
