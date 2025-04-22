'use client';

import React, { useState } from 'react';
import { useQRCode } from 'next-qrcode';
import { redirect, useRouter } from 'next/navigation';
import { useHttpClient } from '@/context/HttpClientContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TwoFASetupResponse } from '@/api/response/2fa';
import { useMe } from '@/hooks/use-me';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const OnboardingPage: React.FC = () => {
  const [copyStatus, setCopyStatus] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const router = useRouter();
  const { Canvas } = useQRCode();
  const client = useHttpClient();
  const me = useMe();
  const queryClient = useQueryClient();

  // Fetch 2FA setup data using React Query.
  const {
    data: qrData,
    isLoading,
    refetch,
  } = useQuery<TwoFASetupResponse>({
    queryKey: ['2fa'],
    queryFn: async () => {
      const response = await client.get<TwoFASetupResponse>(
        '/verify/regenerate-authenticator'
      );
      return response.data;
    },
    enabled: false,
  });

  // Mutation to verify the OTP code.
  const verifyOTPMutation = useMutation({
    mutationFn: async (otp: string) => {
      await client.post('/verify/verify-new-authenticator', { content: otp });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users'],
        exact: false,
      });
    },
    onError: (error) => {
      console.error('OTP verification failed', error);
      setVerifyError('OTP verification failed. Please try again.');
    },
  });

  const handleCopy = () => {
    if (qrData?.tokenSecret) {
      navigator.clipboard
        .writeText(qrData.tokenSecret)
        .then(() => setCopyStatus('Copied!'))
        .catch(() => setCopyStatus('Copy failed'));
    }
  };

  const handleVerifyOTP = async () => {
    setVerifyError('');
    await verifyOTPMutation.mutateAsync(otpCode);
  };

  // If user isn't logged in yet, show a loading state.
  if (me.state !== 'logged-in') return <div>Loading me...</div>;
  // If user already has 2FA, redirect them away.
  if (me.type === 'client' && me.me.has2FA) {
    redirect('/c/');
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading 2FA setup...
      </div>
    );
  if (!qrData)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Welcome to our onboarding process!
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-center max-w-2xl mb-6">
          Your security is our top priority, and enabling Two-Factor
          Authentication (2FA) adds an extra layer of protection to your
          account. Simply set up 2FA using one of our Android or iOS apps, then
          verify with a one-time code. This ensures only <b>you</b> can access
          your account, keeping your data safe. 🔒
        </p>
        <Button onClick={() => refetch()}>Start setting up 2FA!</Button>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Set Up Two-Factor Authentication (2FA)
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
          Scan the QR code below with your Google Authenticator app:
        </p>

        <div className="flex justify-center mb-6">
          <Canvas
            text={qrData.url}
            options={{
              errorCorrectionLevel: 'M',
              width: 256,
              margin: 3,
              color: {
                dark: '#000000',
                light: '#ffffff',
              },
            }}
          />
        </div>

        <p className="text-center text-gray-600 dark:text-gray-200 mb-4">
          Or manually enter this secret:{' '}
          <span
            id={'secret'}
            className="font-semibold text-gray-900 dark:text-gray-100"
          >
            {qrData.tokenSecret}
          </span>
        </p>

        <div className="flex justify-center mb-6">
          <Button onClick={handleCopy}>{copyStatus || 'Copy Secret'}</Button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-center text-gray-900 dark:text-gray-100">
            Verify your authenticator
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
            Enter the OTP code from your authenticator app:
          </p>
          <div className="flex space-x-1 items-center mb-8">
            <Input
              name={'otp'}
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter OTP code"
              className="w-full"
            />
            <div className="flex justify-center">
              <Button id={'verify'} onClick={handleVerifyOTP}>
                Verify OTP
              </Button>
            </div>
          </div>
          {verifyError && (
            <p className="text-red-500 text-center mt-2">{verifyError}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
