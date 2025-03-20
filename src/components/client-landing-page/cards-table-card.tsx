import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/dataTable/DataTable';
import { CardResponseDto } from '@/api/response/cards';
import { cardColumns } from '@/ui/cards/cardColumns';
import React, { useState } from 'react';
import { AccountDto } from '@/api/response/account';
import useTablePageParams from '@/hooks/useTablePageParams';
import { useQuery } from '@tanstack/react-query';
import { searchClientCards } from '@/api/cards';
import { useHttpClient } from '@/context/HttpClientContext';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Dialog2FA } from '@/components/Dialog2FA';
import { AuthorizedPersonDialogForm } from '@/components/cards/AuthorizedPersonDialogForm';
import { AuthorizedPersonFormValues } from '@/components/company/authorized-person-form';
import { CardInfoDialog } from '@/components/cards/card-info-dialog';
import { Plus } from 'lucide-react';

interface CardsTableCardProps {
  selectedAccount: AccountDto;
  onBlockCardAction: (cardNumber: string) => void;
  onRequestCardAction: (request: CardRequestAction) => void;
}

/* probably could make this simpler */
export type CardRequestAction = (
  | { isBusiness: true; isSelf: true }
  | {
      isBusiness: true;
      isSelf: false;
      authorizedUser: AuthorizedPersonFormValues;
    }
  | { isBusiness: false }
) & { otpCode: string; accountNumber: string };

type CardRequestType = 'Personal' | 'BusinessMyself' | 'BusinessOther';

export function CardsTableCard(props: CardsTableCardProps) {
  const client = useHttpClient();
  const [selectedCard, setSelectedCard] = useState<CardResponseDto | null>(
    null
  );
  const [pendingAuthorizedUser, setPendingAuthorizedUser] = useState<
    AuthorizedPersonFormValues | undefined
  >(undefined);

  const [cardRequestType, setCardRequestType] = useState<CardRequestType>();

  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isBlockDialogOpen, setBlockDialogOpen] = useState(false);
  const [isAuthorizedPersonDialogOpen, setIsAuthorizedPersonDialogOpen] =
    useState(false);
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);

  const { page, pageSize, setPage, setPageSize } = useTablePageParams('cards', {
    pageSize: 10,
    page: 0,
  });

  const { data: cards, isLoading: isLoadingCards } = useQuery({
    queryKey: ['cards', props.selectedAccount.accountNumber, page, pageSize],
    queryFn: async () => {
      const accountId = props.selectedAccount.accountNumber;
      const response = await searchClientCards(
        client,
        { accountNumber: accountId },
        page,
        pageSize
      );
      return response.data;
    },
  });

  const handleBlockCardDialog = async (card: CardResponseDto) => {
    setSelectedCard(card);
    setBlockDialogOpen(true);
  };

  const handleViewCardDetails = (card: CardResponseDto) => {
    setSelectedCard(card);
    setIsInfoDialogOpen(true);
  };

  const _onRequestCardAction = (otp: string) => {
    if (cardRequestType === undefined) {
      throw Error('illegal state.');
    }

    setIs2FADialogOpen(false);

    switch (cardRequestType) {
      case 'BusinessMyself':
        return props.onRequestCardAction({
          isBusiness: true,
          isSelf: true,
          otpCode: otp,
          accountNumber: props.selectedAccount.accountNumber,
        });

      case 'BusinessOther':
        if (pendingAuthorizedUser === undefined) {
          throw Error('illegal state.');
        }
        return props.onRequestCardAction({
          isBusiness: true,
          isSelf: false,
          authorizedUser: pendingAuthorizedUser,
          otpCode: otp,
          accountNumber: props.selectedAccount.accountNumber,
        });

      case 'Personal':
        return props.onRequestCardAction({
          isBusiness: false,
          otpCode: otp,
          accountNumber: props.selectedAccount.accountNumber,
        });
    }
  };

  return (
    <>
      {/* Block Card Confirmation Dialog */}
      <ConfirmDialog
        open={isBlockDialogOpen}
        onConfirm={() => {
          if (selectedCard !== null) {
            props.onBlockCardAction(selectedCard.cardNumber);
            setBlockDialogOpen(false);
          }
        }}
        onCancel={() => setBlockDialogOpen(false)}
        title={'Confirm blocking this card'}
        description={'Are you sure you want to block this card?'}
        buttonText="Block"
      />
      {/* 2FA Dialog */}
      <Dialog2FA
        open={is2FADialogOpen}
        onSubmit={_onRequestCardAction}
        onCancel={() => setIs2FADialogOpen(false)}
      />
      <AuthorizedPersonDialogForm
        open={isAuthorizedPersonDialogOpen}
        onOpenChange={setIsAuthorizedPersonDialogOpen}
        onConfirm={(authorizedUser) => {
          setPendingAuthorizedUser(authorizedUser);
          setIsAuthorizedPersonDialogOpen(false);
          setIs2FADialogOpen(true);
        }}
        title="Authorized Person"
        description="Please provide personal information about the person you are requesting this card for."
      />
      <Card className="mt-4 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Cards</CardTitle>
            <CardDescription>
              Manage your cards and request new ones.
            </CardDescription>
          </div>
          <div>
            {props.selectedAccount.accountType === 'CheckingBusiness' ||
            props.selectedAccount.accountType === 'FxBusiness' ? (
              <div className={'space-x-4'}>
                <Button
                  onClick={() => {
                    setCardRequestType('BusinessMyself');
                    setIs2FADialogOpen(true);
                  }}
                >
                  <Plus /> Create a card for myself
                </Button>
                <Button
                  onClick={() => {
                    setCardRequestType('BusinessOther');
                    setIsAuthorizedPersonDialogOpen(true);
                  }}
                >
                  <Plus /> Create a card for someone else
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  setCardRequestType('Personal');
                  setIs2FADialogOpen(true);
                }}
              >
                <Plus /> Create a card
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable<CardResponseDto>
            columns={cardColumns((card) => {
              if (card.cardStatus === 'ACTIVATED') {
                handleBlockCardDialog(card);
              }
            }, handleViewCardDetails)}
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
      {selectedCard && (
        <CardInfoDialog
          open={isInfoDialogOpen}
          onOpenChange={setIsInfoDialogOpen}
          item={{
            ...selectedCard,
            createdDate: selectedCard.creationDate,
            expiryDate: selectedCard.expirationDate,
            status: selectedCard.cardStatus,
            cardOwner: `${selectedCard.client.firstName} ${selectedCard.client.lastName}`,
          }}
        />
      )}
    </>
  );
}
