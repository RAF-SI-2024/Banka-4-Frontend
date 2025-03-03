'use client';

// For mock data
{
  /* <NewTransactionForm
    onSubmitAction={() => console.log('Form submitted with values:')}
    isPending={false}
    selectedAccount={{
      id: '11111111-2222-3333-4444-555555555555',
      balance: 100000000000000000,
      currency: "RSD"
    }}
    defaultValues={{
      recipientName: '',
      recipientAccount: '',
      amount: 0,
      referenceNumber: '',
      paymentCode: '222',
      paymentPurpose: '',
      payerAccount: '',
    }}
    recepients={
      [
        { name: 'John Doe', account: '11111111-2222-3333-4444-555555555555' },
        { name: 'Jane Smith', account: '11111111-2222-3333-4444-555555555555' },
        { name: 'Acme Corp', account: '11111111-2222-3333-4444-555555555555' },
      ]
    }
  /> */
}

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectItem } from '@/components/ui/select';

export type NewTransactionFormValues = z.infer<typeof formSchema>;

export interface NewTransactionFormProps {
  onSubmitAction: (values: NewTransactionFormValues) => void;
  isPending: boolean;
  defaultValues: Partial<NewTransactionFormValues>;
  selectedAccount: { id: string; balance: number; currency: string }; //TODO: add type
  recepients: []; //TODO: add type
}

export default function NewTransactionForm({
  onSubmitAction,
  isPending,
  defaultValues,
  selectedAccount,
  recepients,
}: NewTransactionFormProps) {
  const form = useForm<NewTransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onBlur',
  });
  const [text, setText] = React.useState('');

  function _onSubmit(data: NewTransactionFormValues) {
    onSubmitAction(data);
  }

  const updatedRecipients = [
    { name: 'New recipient', account: '' },
    ...recepients,
  ];

  const handleRecipientChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedRecipient = updatedRecipients.find(
      (recipient) => recipient.name === event.target.value
    );
    if (selectedRecipient) {
      form.setValue(
        'recipientName',
        selectedRecipient.name == 'New recipient' ? '' : selectedRecipient.name
      );
      form.setValue('recipientAccount', selectedRecipient.account);
    }
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    form.setValue('paymentCode', event.target.value);
    setText(PAYMENT_CODE_MAP[event.target.value]);
  };

  return (
    <div className="w-full h-content flex flex-col gap-8 items-start justify-center">
      <h1 className="text-2xl font-bold mb-4">New Payment</h1>
      <div className="w-full flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Account number</h3>
          <p className="italic text-gray-500">{selectedAccount.id}</p>
        </div>
        <div className="flex flex-col items-end">
          <h3 className="text-xl font-semibold">Account balance</h3>
          <p className="italic text-gray-500">
            {selectedAccount.balance} {selectedAccount.currency}
          </p>
        </div>
      </div>
      <div className="flex gap-5 ">
        <h3 className="text-xl font-semibold">Saved recipients</h3>
        <div className="flex flex-wrap gap-4">
          <Select className="max-w-[200px]" onChange={handleRecipientChange}>
            {updatedRecipients.map(
              (recipient: { name: string }, index: number) => (
                <SelectItem
                  key={index}
                  value={recipient.name}
                  className="w-20 text-wrap whitespace-normal"
                >
                  {recipient.name}
                </SelectItem>
              )
            )}
          </Select>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(_onSubmit)}
          className="w-full grid grid-cols-2 gap-4"
        >
          {/* Recipient Name */}
          <FormField
            control={form.control}
            name="recipientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Recipient Name <span className="text-red-500 ">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Recipient Name" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Recipient Account */}
          <FormField
            control={form.control}
            name="recipientAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Recipient Account <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Recipient Account" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Amount <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="Amount" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Reference Number */}
          <FormField
            control={form.control}
            name="referenceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Reference Number" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Payment Purpose */}
          <FormField
            control={form.control}
            name="paymentPurpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Payment Purpose <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Payment Purpose" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Payer Account */}
          <FormField
            control={form.control}
            name="payerAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Payer Account <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Payer Account" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Payment Code */}
          <FormField
            control={form.control}
            name="paymentCode"
            render={({ field }) => (
              <FormItem className="overflow-scroll">
                <FormLabel>
                  Payment Code <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onChange={handleCodeChange}
                    className="max-w-[500px] border border-black"
                  >
                    {Object.keys(PAYMENT_CODE_MAP).map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                        {' - '}
                        {PAYMENT_CODE_MAP[code]}
                      </SelectItem>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <div className="flex items-start justify-between col-span-2">
            <p>{text}</p>
            <div className="flex justify-end w-full">
              <Button
                disabled={isPending}
                type="submit"
                className="px-3 py-1 text-sm"
              >
                {isPending ? 'Processing...' : 'Continue'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

const PAYMENT_CODE_MAP: Record<string, string> = {
  '220':
    'Međufazna potrošnja plaćanja za robu, sirovine, materijal, proizvodne usluge, gorivo, mazivo, energiju, otkup poljoprivrednih proizvoda, članarine, uplate obaveza javnim preduzećima koje nisu propisane i za drugu robu i usluge',
  '221':
    'Finalna potrošnja plaćanja za robu, sirovine, materijal, proizvodne usluge, gorivo, mazivo, energiju, otkup poljoprivrednih proizvoda, članarine, uplate obaveza javnim preduzećima koje nisu propisane i za drugu robu i usluge (uključujući plaćanje svih provizija i naknada), izuzev za investicije - finalna potrošnja',
  '222': 'Uplate javnim preduzećima propisanih obaveza',
  '223':
    'Plaćanja po osnovu izgradnje objekata i nabavke opreme (nabavna cena, doprema, montaža i dr.)',
  '224': 'Plaćanja po osnovu investicija, osim investicija u objekte i opremu',
  '225':
    'Zakupnine za korišćenje nepokretnosti i pokretnih stvari u državnoj svojini, naknade za druge usluge koje imaju karakter javnih prihoda',
  '226':
    'Zakupnine za korišćenje nepokretnosti i pokretnih stvari na koje se plaća porez prema zakonu',
  '227':
    'Isplata, naplata, prenos i obračun po osnovu subvencija, regresa i premija sa konsolidovanog računa trezora, odnosno fondova i organizacija obaveznog socijalnog osiguranja',
  '228':
    'Isplata, naplata, prenos i obračun po osnovu subvencija, regresa i premija sa ostalih računa',
  '231':
    'Uplata, naplata, prenos sa računa i obračun po osnovu izmirenja carina i drugih uvoznih dažbina (carine i drugi javni prihodi koje uprava carina naplati objedinjeno na svoj evidentni račun)',
  '240':
    'Zarade, naknada zarada, dodatak na zaradu (regres, topli obrok, terenski dodatak) i primanja zaposlenih (po osnovu privremenih i povremenih poslova i po osnovu ugovora o radu van prostorija poslodavca), osim isplata u gotovom novcu',
  '241':
    'Neoporeziva primanja zaposlenih, socijalna i druga davanja izuzeta od oporezivanja',
  '242': 'Naknade zarada na teret poslodavca',
  '244': 'Isplata članovima zadruge sa računa zadruge',
  '245':
    'Iznos penzija koji se isplaćuje penzionerima ili prenosi na njihove tekuće račune u banci i drugoj finansijskoj organizaciji, osim isplata u gotovom novcu',
  '246': 'Obustave od penzija i zarada',
  '247': 'Naknade zarada na teret drugih isplatilaca',
  '248': 'Prihodi fizičkih lica od kapitala i drugih imovinskih prava',
  '249': 'Ostali prihodi fizičkih lica',
  '253': 'Uplata javnih prihoda izuzev poreza i doprinosa po odbitku',
  '254': 'Uplata poreza i doprinosa po odbitku',
  '257':
    'Povraćaj više ili pogrešno naplaćenih tekućih prihoda: prenos sredstava sa uplatnog računa tekućeg prihoda u korist poreskog obveznika, na ime više plaćenih ili pogrešno naplaćenih tekućih prihoda',
  '258':
    'Preknjižavanje više ili pogrešno uplaćenih tekućih prihoda: prenos sredstava sa jednog uplatnog računa tekućeg prihoda u korist drugog, a na ime više uplaćenih ili pogrešno uplaćenih tekućih prihoda',
  '260': 'Premija osiguranja, reosiguranje, nadoknada štete',
  '261':
    'Raspored poreza, doprinosa i drugih tekućih prihoda uplaćenih korisnicima',
  '262':
    'Prenos u okviru računa i podračuna trezora, prenos sredstava budžetskim korisnicima, isplate po socijalnom programu vlade',
  '263':
    'Prenos u okviru istog pravnog lica i drugi transferi, raspored zajedničkog prihoda',
  '264':
    'Prenos sredstava iz budžeta na uplatni račun tekućeg prihoda s kog je potrebno izvršiti povraćaj sredstava koja će se vratiti obvezniku',
  '265': 'Uplata dnevnog pazara',
  '266': 'Sve gotovinske isplate sa računa pravnog lica i preduzetnika',
  '270': 'Prenos sredstava po osnovu odobrenih kratkoročnih kredita',
  '271': 'Prenos sredstava po osnovu odobrenih dugoročnih kredita',
  '272': 'Plaćanje kamate po kreditima',
  '273': 'Polaganje oročenih depozita',
  '278': 'Povraćaj oročenih depozita',
  '275':
    'Kupoprodaja vlasničkih hartija od vrednosti, kupovina kapitala u postupku privatizacije u smislu zakona kojim se uređuje privatizacija i kupovina udela iz akcijskog fonda republike srbije, međubankarski plasman (hartije, krediti)',
  '276': 'Otplata kratkoročnih kredita',
  '277': 'Otplata dugoročnih kredita',
  '279': 'Plaćanje kamate po depozitima i drugim novčanim polozima',
  '280': 'Eskont hartija od vrednosti',
  '281': 'Uplata pozajmice osnivača – fizičkog lica pravnom licu',
  '282':
    'Povraćaj pozajmice za likvidnost osnivaču povraćaj pozajmice pravnog lica osnivaču – fizičkom licu',
  '283': 'Naplata čekova građana',
  '284': 'Platne kartice',
  '285': 'Menjački poslovi',
  '286': 'Kupoprodaja deviza',
  '287':
    'Plaćanja iz sredstava banaka i drugih pravnih lica po osnovu interne regulative',
  '288': 'Donacije iz međunarodnih ugovora',
  '289': 'Transakcije po nalogu građana',
  '290': 'Druge transakcije',
};

const PAYMENT_CODES = Object.keys(PAYMENT_CODE_MAP) as [
  keyof typeof PAYMENT_CODE_MAP,
  ...(keyof typeof PAYMENT_CODE_MAP)[],
];

const formSchema = z.object({
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientAccount: z.string().min(1, 'Recipient account is required'),
  amount: z.number().min(1, 'Amount is required'),
  referenceNumber: z.string().optional(),
  paymentCode: z.enum(PAYMENT_CODES, {
    required_error: 'Payment code is required',
  }),
  paymentPurpose: z.string().min(1, 'Payment purpose is required'),
  payerAccount: z.string().min(1, 'Payer account is required'),
});
