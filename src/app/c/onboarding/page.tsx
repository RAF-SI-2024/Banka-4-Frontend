'use client';

import React, { useState } from 'react';
import { useQRCode } from 'next-qrcode';
import { redirect, useRouter } from 'next/navigation';
import { useHttpClient } from '@/context/HttpClientContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TwoFASetupResponse } from '@/api/response/2fa';
import { useMe } from '@/hooks/use-me';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
    error,
  } = useQuery<TwoFASetupResponse>({
    queryKey: ['2fa'],
    queryFn: async () => {
      const response = await client.get<TwoFASetupResponse>(
        '/verify/regenerate-authenticator'
      );
      return response.data;
    },

    enabled: me.state === 'logged-in' && me.type === 'client' && !me.me.has2FA,
  });

  // Mutation to verify the OTP code.
  const verifyOTPMutation = useMutation({
    mutationFn: async (otp: string) => {
      await client.post('/verify/verify-new-authenticator', { content: otp });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
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
    try {
      await verifyOTPMutation.mutateAsync(otpCode);
      handleCompleteOnboarding();
    } catch (error) {
      console.error('OTP verification failed', error);
      setVerifyError('OTP verification failed. Please try again.');
    }
  };

  const handleCompleteOnboarding = () => {
    router.push('/c/');
  };


  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading 2FA setup...
      </div>
    );
  if (!qrData)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Error loading 2FA setup.
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Set Up Two-Factor Authentication (2FA)
        </h1>
        <p className="text-gray-700 text-center mb-6">
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

        <p className="text-center text-gray-600 mb-4">
          Or manually enter this secret:{' '}
          <span className="font-semibold">{qrData.tokenSecret}</span>
        </p>

        <div className="flex justify-center mb-6">
          <Button onClick={handleCopy}>{copyStatus || 'Copy Secret'}</Button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Verify your authenticator
          </h2>
          <p className="text-gray-700 text-center mb-4">
            Enter the OTP code from your authenticator app:
          </p>
          <div className="flex space-x-1 items-center mb-8">
            <Input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter OTP code"
              className="w-full"
            />
            <div className="flex justify-center">
              <Button onClick={handleVerifyOTP}>Verify OTP</Button>
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
