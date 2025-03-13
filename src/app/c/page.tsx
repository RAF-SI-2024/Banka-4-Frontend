'use client';

import { TransactionDto } from '@/api/response/transaction';
import { AccountDto, CurrencyDto } from '@/api/response/account';
import React, { useEffect, useState } from 'react';
import { AccountCarousel } from '@/components/account/account-carousel';
import { DataTable } from '@/components/dataTable/DataTable';
import { useQuery } from '@tanstack/react-query';
import { useHttpClient } from '@/context/HttpClientContext';
import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardHeader,
  Card,
  CardTitle,
} from '@/components/ui/card';
import { transactionColumns } from '@/ui/dataTables/transactions/transactionColumns';
import { cardColumns } from '@/ui/cards/cardColumns';
import GuardBlock from '@/components/GuardBlock';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { searchTransactions, TransactionFilters } from '@/api/transaction';
import { getClientAccounts } from '@/api/account';
import { searchClientCards, createCard, blockCard } from '@/api/cards';
import { Tabs, TabsList } from '@/components/ui/tabs';
import { RequestCardDialog } from '@/components/cards/RequestCardDialog';
import { useSearchParams } from 'next/navigation';
import useTablePageParams from '@/hooks/useTablePageParams';
import { TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { CardInfoDialog } from '@/components/cards/card-info-dialog';
import { Dialog2FA } from '@/components/Dialog2FA';
import { Button } from '@/components/ui/button';
import { CardResponseDto } from '@/api/response/cards';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { AuthorizedUserDto } from '@/api/request/authorized-user';

export default function ClientPage() {
  const [selectedAccount, setSelectedAccount] = useState<AccountDto | null>(
    null
  );
  const [selectedCard, setSelectedCard] = useState<CardResponseDto | null>(
    null
  );
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const client = useHttpClient();
  const [isBlockDialogOpen, setBlockDialogOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [pendingAuthorizedUser, setPendingAuthorizedUser] = useState<
    AuthorizedUserDto | undefined
  >(undefined);
  const { page, pageSize, setPage, setPageSize } = useTablePageParams('cards', {
    pageSize: 10,
    page: 0,
  });

  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [{ title: 'Home' }],
    });
  }, [dispatch]);

  const {
    data: cards,
    isLoading: isLoadingCards,
    refetch: refetchCards,
  } = useQuery({
    queryKey: ['cards', selectedAccount?.accountNumber, page, pageSize],
    queryFn: async () => {
      const accountId = selectedAccount?.accountNumber ?? undefined;
      const response = await searchClientCards(
        client,
        { accountNumber: accountId },
        page,
        pageSize
      );
      return response.data;
    },
    enabled: !!selectedAccount,
  });

  const { data: accounts } = useQuery<AccountDto[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await getClientAccounts(client);
      return response.data;
    },
  });

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ['transactions', selectedAccount?.accountNumber, page, pageSize],
    queryFn: async () => {
      const accountId = selectedAccount?.accountNumber ?? undefined;
      const response = await searchTransactions(
        client,
        { accountNumber: accountId },
        page,
        pageSize
      );
      return response.data;
    },
    enabled: !!selectedAccount,
  });

  useEffect(() => {
    refetchTransactions();
    refetchCards();
  }, [selectedAccount, refetchTransactions, refetchCards]);

  const handleRequestNewCard = async () => {
    if (!selectedAccount) return;

    if (selectedAccount.accountType === 'CheckingPersonal') {
      setIs2FADialogOpen(true);
    } else {
      setIsRequestDialogOpen(true);
    }
  };

  const handleBlockCardDialog = async (card: CardResponseDto) => {
    setSelectedCard(card);
    setBlockDialogOpen(true);
  };

  const handleViewCardDetails = (card: CardResponseDto) => {
    setSelectedCard(card);
    setIsDialogOpen(true);
  };

  const confirmRequestCardWith2FA = async (otp: string) => {
    const requestData = {
      accountNumber: selectedAccount?.accountNumber ?? '',
      createAuthorizedUserDto: pendingAuthorizedUser || undefined,
      otpCode: otp,
    };
    await createCard(client, requestData, otp);
    refetchCards();
    setIs2FADialogOpen(false);
    setIsRequestDialogOpen(false);
    setPendingAuthorizedUser(undefined);
  };

  const handleBlockCard = async () => {
    if (selectedCard) {
      await blockCard(client, selectedCard.cardNumber);
      refetchCards();
      setBlockDialogOpen(false);
    }
  };

  const [transactionFilters, setTransactionFilters] =
    useState<TransactionFilters>({
      date: undefined,
      status: undefined,
      amount: undefined,
      accountNumber: '',
    });

  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts, selectedAccount]);

  useEffect(() => {
    if (selectedAccount) {
      setTransactionFilters((prevFilters) => ({
        ...prevFilters,
        accountNumber: selectedAccount.accountNumber,
      }));
    }
  }, [selectedAccount]);

  return (
    <GuardBlock requiredUserType={'client'}>
      {/* Card Info Dialog */}
      {selectedCard && (
        <CardInfoDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          item={{
            cardNumber: selectedCard.cardNumber,
            cardType: selectedCard.cardType,
            cardName: selectedCard.cardName,
            createdDate: selectedCard.creationDate,
            expiryDate: selectedCard.expirationDate,
            accountNumber: selectedCard.accountNumber,
            cvv: selectedCard.cvv,
            limit: selectedCard.limit,
            status: selectedCard.cardStatus,
            cardOwner: `${selectedCard.client.firstName} ${selectedCard.client.lastName}`,
          }}
        />
      )}
      {/* Block Card Confirmation Dialog */}
      <ConfirmDialog
        open={isBlockDialogOpen}
        onConfirm={handleBlockCard}
        onCancel={() => setBlockDialogOpen(false)}
        title={'Confirm blocking this card'}
        description={'Are you sure you want to block this card?'}
        buttonText="Block"
      />
      {/* 2FA Dialog */}
      <Dialog2FA
        open={is2FADialogOpen}
        onSubmit={confirmRequestCardWith2FA}
        onCancel={() => setIs2FADialogOpen(false)}
      />
      <RequestCardDialog
        open={isRequestDialogOpen}
        onConfirm={(authorizedUser) => {
          setPendingAuthorizedUser(authorizedUser);
          setIsRequestDialogOpen(false);
          setIs2FADialogOpen(true);
        }}
        onCancel={() => setIsRequestDialogOpen(false)}
        title="Request New Card"
        description="Please provide the details for the new card request."
        accountType={selectedAccount?.accountType ?? ''}
      />
      {accounts && (
        <AccountCarousel
          items={accounts.map((account) => ({
            accountNumber: account.accountNumber,
            balance: account.balance,
            currencyCode: account.currency.code,
            owner: account.client.firstName + ' ' + account.client.lastName,
            type: account.accountType,
            availableBalance: account.availableBalance,
            reservedBalance: 0,
          }))}
          onSelect={(accountNumber: string) => {
            const account =
              accounts?.find((acc) => acc.accountNumber === accountNumber) ||
              null;
            setSelectedAccount(account);
          }}
        />
      )}
      {selectedAccount && (
        <div className={'p-8'}>
          <Tabs
            defaultValue="transactions"
            className="flex flex-col items-center"
          >
            <TabsList className="flex justify-center bg-gray-100 p-2 rounded-lg">
              <TabsTrigger
                value="transactions"
                className="px-6 py-2 rounded-lg"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger value="cards" className="px-6 py-2 rounded-lg">
                Cards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
              <Card className="mt-4 shadow-md">
                <CardHeader>
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>
                    View all transactions related to your accounts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable<TransactionDto>
                    onRowClick={(row) => setSelectedTransaction(row.original)}
                    columns={transactionColumns}
                    data={transactions?.content ?? []}
                    isLoading={isLoadingTransactions}
                    pageCount={transactions?.page.totalPages ?? 0}
                    pagination={{ page, pageSize }}
                    onPaginationChange={(newPagination) => {
                      setPage(newPagination.page);
                      setPageSize(newPagination.pageSize);
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cards">
              <Card className="mt-4 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Cards</CardTitle>
                    <CardDescription>
                      Manage your cards and request new ones.
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleRequestNewCard}
                    className="bg-green-700"
                  >
                    Request new card
                  </Button>
                </CardHeader>
                <CardContent>
                  <DataTable<CardResponseDto>
                    columns={cardColumns(
                      handleBlockCardDialog,
                      handleViewCardDetails
                    )}
                    data={cards?.content ?? []}
                    isLoading={isLoadingCards}
                    pageCount={cards?.page.totalPages ?? 0}
                    pagination={{ page, pageSize }}
                    onPaginationChange={(newPagination) => {
                      setPage(newPagination.page);
                      setPageSize(newPagination.pageSize);
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </GuardBlock>
  );
}
