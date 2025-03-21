'use client';

import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { useMe } from '@/hooks/use-me';

interface LoginBlockProps {
  children: ReactNode;
}

const LoginBlock: React.FC<LoginBlockProps> = ({ children }) => {
  const me = useMe();

  if (me.state === 'loading') {
    return <div>Loading...</div>;
  }

  if (me.state === 'logged-in') return <>Already logged in!</>;

  return <>{children}</>;
};

export default LoginBlock;
