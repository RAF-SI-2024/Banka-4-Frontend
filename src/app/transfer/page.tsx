'use client';

import TransferForm from '@/components/transfer/transfer-form';

export default function TransferPage() {
  // Mock podaci za testiranje računa
  const mockAccounts = [
    {
      id: '1',
      accountNumber: '265000000123456789',
      availableBalance: 558600.0,
      currency: { code: 'RSD', symbol: 'RSD' },
    },
    {
      id: '2',
      accountNumber: '265000000987654321',
      availableBalance: 153555.0,
      currency: { code: 'RSD', symbol: 'RSD' },
    },
    {
      id: '3',
      accountNumber: '112233445566778899',
      availableBalance: 3200.5,
      currency: { code: 'EUR', symbol: '€' },
    },
    {
      id: '4',
      accountNumber: '998877665544332211',
      availableBalance: 5200.75,
      currency: { code: 'EUR', symbol: '€' },
    },
  ];

  // Funkcija koja hendluje submit
  const handleTransferSubmit = (transferData: {
    fromAccount: string;
    toAccount: string;
    amount: number;
  }) => {
    console.log('Transfer Data:', transferData);
    alert(
      `Transfer request submitted!\n\nFrom: ${transferData.fromAccount}\nTo: ${transferData.toAccount}\nAmount: ${transferData.amount}`
    );
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <TransferForm accounts={mockAccounts} onSubmit={handleTransferSubmit} />
    </div>
  );
}
