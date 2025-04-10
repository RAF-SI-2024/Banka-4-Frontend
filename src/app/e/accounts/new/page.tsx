'use client';

import { useEffect, useState } from 'react';
import NewClientStage from '@/app/e/accounts/new/new-client';
import PickBetween from '@/app/e/accounts/new/pick-between';
import {
  BriefcaseBusiness,
  UserRound,
  UserRoundCheck,
  UserRoundPlus,
} from 'lucide-react';
import { CompanyFormData } from '@/components/company/company-form';
import NewCompanyStage from '@/app/e/accounts/new/new-company';
import FinalNewAccountStage from '@/app/e/accounts/new/final-new-account-stage';
import { AccountFormData } from '@/components/account/account-form';
import NewAccountResult from '@/app/e/accounts/new/new-account-result';
import { AnimatePresence, motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import {
  ExistingClientDto,
  NewAccountDto,
  NewClientDto,
} from '@/api/request/account';
import { useHttpClient } from '@/context/HttpClientContext';
import { postNewAccount } from '@/api/account';
import PickExistingClient from '@/app/e/accounts/new/pick-existing-client';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import GuardBlock from '@/components/GuardBlock';

enum NewAccountStage {
  NewOrExistingClient,
  NewClient,
  ExistingClient,
  PersonalOrCompany,
  Company,
  Final,
  Result,
}

type ClientRequest =
  | {
      isNew: true;
      client: NewClientDto;
    }
  | {
      isNew: false;
      client: ExistingClientDto;
    };

export default function NewAccountPage() {
  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/e' },
        { title: 'Accounts', url: '/e/accounts' },
        { title: 'New' },
      ],
    });
  }, [dispatch]);
  const httpClient = useHttpClient();

  const [stage, setStage] = useState<NewAccountStage>(
    NewAccountStage.NewOrExistingClient
  );
  const [isSuccess, setIsSuccess] = useState<boolean>();
  const [client, setClient] = useState<ClientRequest>();
  const [company, setCompany] = useState<CompanyFormData | null>();
  const [account, setAccount] = useState<AccountFormData>();

  const { mutate: createAccount, reset: resetMutation } = useMutation({
    mutationFn: async (data: NewAccountDto) =>
      await postNewAccount(httpClient, data),
    onSuccess: () => setIsSuccess(true),
    onError: () => setIsSuccess(false),
  });

  const onCreateAccount = (accountData: AccountFormData) => {
    setIsSuccess(undefined);

    if (client === undefined || company === undefined) {
      throw Error('unreachable state. (should be)');
    }

    const requestData = {
      client: client.client,
      company: company,
      availableBalance: accountData.amount,
      currency: accountData.currency,
      createCard: accountData.makeCard,
    };

    createAccount(requestData);
  };

  const renderStages = () => {
    switch (stage) {
      case NewAccountStage.NewOrExistingClient:
        return (
          <PickBetween
            title={'Is this account for an existing client or a new one?'}
            firstOptionText={'pick an existing client'}
            secondOptionText={'create a new client'}
            firstOptionIcon={UserRoundCheck}
            secondOptionIcon={UserRoundPlus}
            onFirstOptionSelected={() =>
              setStage(NewAccountStage.ExistingClient)
            }
            onSecondOptionSelected={() => setStage(NewAccountStage.NewClient)}
          />
        );
      case NewAccountStage.ExistingClient:
        return (
          <PickExistingClient
            onClientPicked={(c) => {
              setClient({
                isNew: false,
                client: { id: c.id },
              });
              setStage(NewAccountStage.PersonalOrCompany);
            }}
          />
        );
      case NewAccountStage.NewClient:
        return (
          <NewClientStage
            onNewClientSubmitted={(c) => {
              setClient({
                isNew: true,
                client: {
                  ...c,
                  phone: c.phoneNumber,
                  dateOfBirth: c.dateOfBirth.toISOString(),
                  privilege: !c.privilege ? [] : [c.privilege],
                },
              });
              setStage(NewAccountStage.PersonalOrCompany);
            }}
          />
        );
      case NewAccountStage.PersonalOrCompany:
        return (
          <PickBetween
            title={'Is this a Personal or Business account?'}
            firstOptionText={'Personal'}
            secondOptionText={'Business'}
            firstOptionIcon={UserRound}
            secondOptionIcon={BriefcaseBusiness}
            onFirstOptionSelected={() => {
              setCompany(null);
              setStage(NewAccountStage.Final);
            }}
            onSecondOptionSelected={() => setStage(NewAccountStage.Company)}
          />
        );
      case NewAccountStage.Company:
        return (
          <NewCompanyStage
            onNewCompanySubmitted={(company: CompanyFormData) => {
              setCompany(company);
              setStage(NewAccountStage.Final);
            }}
          />
        );
      case NewAccountStage.Final:
        return (
          <FinalNewAccountStage
            onFinishNewAccount={(acc) => {
              setAccount(acc);
              onCreateAccount(acc);
              setStage(NewAccountStage.Result);
            }}
          />
        );
      case NewAccountStage.Result:
        return (
          <NewAccountResult
            isSuccess={isSuccess}
            onTryAgainAction={() => {
              resetMutation();
              if (account !== undefined) {
                onCreateAccount(account);
              } else {
                throw Error('unreachable.');
              }
            }}
          />
        );
    }
  };

  return (
    <GuardBlock requiredUserType={'employee'}>
      <AnimatePresence mode={'wait'}>
        <motion.div
          key={stage}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="component-wrapper"
        >
          {renderStages()}
        </motion.div>
      </AnimatePresence>
    </GuardBlock>
  );
}
