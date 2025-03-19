'use client';

import { LoanDto, LoansResponseDto } from '@/api/response/loan';
import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/dataTable/DataTable';
import { useQuery } from '@tanstack/react-query';
import { useHttpClient } from '@/context/HttpClientContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import GuardBlock from '@/components/GuardBlock';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { searchLoans, getLoanInstallments } from '@/api/loans';
import useTablePageParams from '@/hooks/useTablePageParams';
import { loanColumns } from '@/ui/dataTables/loans/loanColumns';
import { LoanDialog } from '@/components/loans/LoanDialog';
import { LoanInstallmentsDialog } from '@/components/loans/LoanInstallmentsDialog';
import { Button } from '@/components/ui/button';
import { LoanInstallmentDto } from '@/api/response/loan';

const ClientLoanOverviewPage: React.FC = () => {
  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/c' },
        { title: 'Loans', url: '/c/loans' },
        { title: 'Overview' },
      ],
    });
  }, [dispatch]);

  const [selectedLoan, setSelectedLoan] = useState<LoanDto>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLoanNumber, setSelectedLoanNumber] = useState<number | null>(
    null
  );
  const [isInstallmentsDialogOpen, setIsInstallmentsDialogOpen] =
    useState(false);
  const client = useHttpClient();
  const { page, pageSize, setPage, setPageSize } = useTablePageParams('loans', {
    pageSize: 8,
    page: 0,
  });

  const { data: loans, isLoading } = useQuery<LoansResponseDto>({
    queryKey: ['loans', page, pageSize],
    queryFn: async () => {
      return (await searchLoans(client, page, pageSize)).data;
    },
  });

  const handleViewDetails = (loan: LoanDto) => {
    setSelectedLoan(loan);
    setIsDialogOpen(true);
  };

  const handleViewInstallments = (loanNumber: number) => {
    setSelectedLoanNumber(loanNumber);
    setIsInstallmentsDialogOpen(true);
  };

  return (
    <GuardBlock requiredUserType={'client'}>
      {selectedLoan && (
        <LoanDialog
          dto={selectedLoan}
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
        />
      )}
      <LoanInstallmentsDialog
        loanNumber={selectedLoanNumber}
        open={isInstallmentsDialogOpen}
        setOpen={setIsInstallmentsDialogOpen}
      />
      ;
      <div className="p-8">
        <Card className="max-w-[900px] w-full mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-bold">Loans Overview</h1>
            <CardDescription>
              This table provides a clear and organized overview of key loan
              details for quick reference and easy access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={loanColumns(handleViewDetails, handleViewInstallments)}
              data={loans?.content ?? []}
              isLoading={isLoading}
              pagination={{ page, pageSize }}
              onPaginationChange={(pagination) => {
                setPage(pagination.page);
                setPageSize(pagination.pageSize);
              }}
              pageCount={loans?.page.totalPages ?? 0}
            />
          </CardContent>
        </Card>
      </div>
    </GuardBlock>
  );
};

export default ClientLoanOverviewPage;
