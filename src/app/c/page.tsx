'use client';

import { AccountDto } from '@/api/response/account';
import React, { useEffect, useState } from 'react';
import { AccountCarousel } from '@/components/account/account-carousel';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useHttpClient } from '@/context/HttpClientContext';
import GuardBlock from '@/components/GuardBlock';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { getClientAccounts } from '@/api/account';
import { blockCard, createCard } from '@/api/cards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionsCard from '@/components/client-landing-page/transactions-card';
import {
  CardRequestAction,
  CardsTableCard,
} from '@/components/client-landing-page/cards-table-card';
import { toast } from 'sonner';
import { CreateCardRequest } from '@/api/request/card';
import moment from 'moment';

export default function ClientPage() {
  const [selectedAccount, setSelectedAccount] = useState<AccountDto | null>(
    null
  );
  const client = useHttpClient();
  const queryClient = useQueryClient();

  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [{ title: 'Home' }],
    });
  }, [dispatch]);

  const { data: accounts, isSuccess } = useQuery<AccountDto[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      return (await getClientAccounts(client)).data;
    },
  });

  useEffect(() => {
    if (isSuccess) {
      if (accounts.length > 0) {
        setSelectedAccount(accounts[0]);
      }
    }
  }, [isSuccess, setSelectedAccount, accounts]);

  const { mutate: doBlockCard } = useMutation({
    mutationKey: ['cards'],
    mutationFn: async (cardNumber: string) =>
      await blockCard(client, cardNumber),
    onSuccess: () => {
      toast.success('card blocked successfully!');
    },
  });

  const { mutate: doCreateCard } = useMutation({
    mutationKey: ['cards'],
    mutationFn: async (data: CreateCardRequest) =>
      await createCard(client, data),
    onSuccess: () => {
      toast.success('card created successfully!');
    },
  });

  const onCreateCardRequest = (request: CardRequestAction) => {
    if (request.isBusiness && !request.isSelf) {
      doCreateCard({
        createAuthorizedUserDto: {
          firstName: request.authorizedUser.firstName,
          lastName: request.authorizedUser.lastName,
          dateOfBirth: moment(request.authorizedUser.dateOfBirth).format(
            'YYYY-MM-DD'
          ),
          gender: request.authorizedUser.gender,
          email: request.authorizedUser.email,
          phoneNumber: request.authorizedUser.phoneNumber,
          address: request.authorizedUser.address,
        },
        accountNumber: request.accountNumber,
        otpCode: request.otpCode,
      });
    } else {
      doCreateCard({
        createAuthorizedUserDto: null,
        accountNumber: request.accountNumber,
        otpCode: request.otpCode,
      });
    }
  };

  return (
    <GuardBlock requiredUserType={'client'}>
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
            company: account.company,
            dailyLimit: account.dailyLimit,
            monthlyLimit: account.monthlyLimit,
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
        <div className={'flex items-center justify-center'}>
          <Tabs defaultValue="transactions" className="w-[900px]">
            <TabsList className={'w-full'}>
              <TabsTrigger
                value="transactions"
                className="px-6 py-2 rounded-lg w-full"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="cards"
                className="px-6 py-2 rounded-lg w-full"
              >
                Cards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
              <TransactionsCard selectedAccount={selectedAccount} />
            </TabsContent>

            <TabsContent value="cards">
              <CardsTableCard
                onBlockCardAction={doBlockCard}
                onRequestCardAction={onCreateCardRequest}
                selectedAccount={selectedAccount}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </GuardBlock>
  );
}
