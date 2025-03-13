'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { useHttpClient } from '@/context/HttpClientContext';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import GuardBlock from '@/components/GuardBlock';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  blockCard,
  CardFilter,
  deactivateCard,
  searchCards,
  unblockCard,
} from '@/api/cards';
import { DataTable } from '@/components/dataTable/DataTable';
import { cardsColumns } from '@/ui/dataTables/cards/cardsColumns';
import useTablePageParams from '@/hooks/useTablePageParams';
import { FilterBar, FilterDefinition } from '@/components/filters/FilterBar';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { CardResponseDto } from '@/api/response/cards';
import { toastRequestError } from '@/api/errors';
import { toast } from 'sonner';
import { ALL_CARD_STATUSES } from '@/types/card';

type CardAction = 'BLOCK' | 'UNBLOCK' | 'DEACTIVATE';

const EmployeeManageCardsPage: React.FC = () => {
  const { page, pageSize, setPage, setPageSize } = useTablePageParams('cards', {
    pageSize: 8,
    page: 0,
  });

  const [cardFilter, setCardFilter] = useState<CardFilter>({
    cardNumber: undefined,
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    cardStatus: undefined,
  });

  const cardFilterColumns: Record<keyof CardFilter, FilterDefinition> = {
    accountNumber: {
      filterType: 'string',
      placeholder: 'Enter account number',
    },
    cardNumber: {
      filterType: 'string',
      placeholder: 'Enter card number',
    },
    firstName: {
      filterType: 'string',
      placeholder: 'Enter first name',
    },
    lastName: {
      filterType: 'string',
      placeholder: 'Enter last name',
    },
    email: {
      filterType: 'string',
      placeholder: 'Enter email',
    },
    cardStatus: {
      filterType: 'enum',
      placeholder: 'Enter card status',
      options: ALL_CARD_STATUSES,
      optionToString: (option) => option,
    },
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState<CardResponseDto | null>(null);
  const [currentAction, setCurrentAction] = useState<CardAction>();

  const { mutate: doBlock } = useMutation({
    mutationKey: ['card', currentCard?.cardNumber],
    mutationFn: async (cardNumber: string) => blockCard(client, cardNumber),
    onSuccess: () => {
      resetState();
      queryClient.invalidateQueries({
        queryKey: ['card'],
        exact: false,
      });
      toast('Card blocked successfully');
    },
    onError: (error) => toastRequestError(error),
  });

  const { mutate: doUnblock } = useMutation({
    mutationKey: ['card', currentCard?.cardNumber],
    mutationFn: async (cardNumber: string) => unblockCard(client, cardNumber),
    onSuccess: () => {
      resetState();
      queryClient.invalidateQueries({
        queryKey: ['card'],
        exact: false,
      });
      toast('Card blocked successfully');
    },
    onError: (error) => toastRequestError(error),
  });

  const { mutate: doDeactivate } = useMutation({
    mutationKey: ['card', currentCard?.cardNumber],
    mutationFn: async (cardNumber: string) =>
      deactivateCard(client, cardNumber),
    onSuccess: () => {
      resetState();
      queryClient.invalidateQueries({
        queryKey: ['card'],
        exact: false,
      });
      toast('Card blocked successfully');
    },
    onError: (error) => toastRequestError(error),
  });

  const handleBlockUnblock = (card: CardResponseDto) => {
    setCurrentCard(card);
    if (card.cardStatus === 'ACTIVATED') {
      setCurrentAction('BLOCK');
    } else if (card.cardStatus === 'DEACTIVATED') {
      setCurrentAction('UNBLOCK');
    } else {
      throw Error('invalid state');
    }
    setDialogOpen(true);
  };

  const handleDeactivate = (card: CardResponseDto) => {
    setCurrentCard(card);
    setCurrentAction('DEACTIVATE');
    setDialogOpen(true);
  };

  const client = useHttpClient();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['card', page, pageSize, cardFilter],
    queryFn: async () => {
      const response = await searchCards(client, cardFilter, pageSize, page);
      return response.data;
    },
  });

  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/e' },
        { title: 'Cards', url: '/e/cards' },
        { title: 'Overview' },
      ],
    });
  }, [dispatch]);

  const handleConfirm = async () => {
    if (currentCard && currentAction) {
      switch (currentAction) {
        case 'UNBLOCK':
          doUnblock(currentCard.cardNumber);
          return;
        case 'BLOCK':
          doBlock(currentCard.cardNumber);
          return;
        case 'DEACTIVATE':
          doDeactivate(currentCard.cardNumber);
          return;
      }
    }
  };

  const resetState = () => {
    setCurrentCard(null);
    setCurrentAction(undefined);
    setDialogOpen(false);
  };

  return (
    <GuardBlock requiredUserType={'employee'}>
      <div className="p-8">
        <Card className="max-w-[900px] mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-bold">Cards Overview</h1>
            <CardDescription>
              This table provides a clear and organized overview of all cards in
              the bank and key details about them.
            </CardDescription>
            <FilterBar<CardFilter, typeof cardFilterColumns>
              onSubmit={(filter) => {
                setPage(0);
                setCardFilter(filter);
              }}
              filter={cardFilter}
              columns={cardFilterColumns}
            />
          </CardHeader>
          <CardContent className="rounded-lg overflow-hidden">
            <DataTable
              columns={cardsColumns({
                handleBlockUnblock,
                handleDeactivate,
              })}
              data={data?.content ?? []}
              isLoading={isLoading}
              pageCount={data?.page.totalPages ?? 0}
              pagination={{ page: page, pageSize }}
              onPaginationChange={(newPagination) => {
                setPage(newPagination.page);
                setPageSize(newPagination.pageSize);
              }}
            />
          </CardContent>
        </Card>
      </div>
      {currentAction && currentCard && dialogOpen && (
        <ConfirmDialog
          open={dialogOpen}
          onConfirm={handleConfirm}
          onCancel={resetState}
          title={resolveDialogTitle(currentAction)}
          description={resolveDialogDescription(currentAction)}
        />
      )}
    </GuardBlock>
  );
};

function resolveDialogTitle(cardAction: CardAction) {
  switch (cardAction) {
    case 'BLOCK':
      return 'Block Card';
    case 'UNBLOCK':
      return 'Unblock Card';
    case 'DEACTIVATE':
      return 'Deactivate Card';
  }
}

function resolveDialogDescription(cardAction: CardAction) {
  switch (cardAction) {
    case 'BLOCK':
      return 'Are you sure you want to block this card?';
    case 'UNBLOCK':
      return 'Are you sure you want to unblock this card?';
    case 'DEACTIVATE':
      return 'Are you sure you want to deactivate this card? This action cannot be undone.';
  }
}

export default EmployeeManageCardsPage;
