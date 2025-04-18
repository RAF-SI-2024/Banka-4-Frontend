'use client';

import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Privilege } from '@/types/privileges';
import { useMe } from '@/hooks/use-me';
import { UserType } from '@/api/auth';

interface GuardBlockProps {
  requiredUserType?: UserType;
  requiredPrivileges?: Privilege[];
  children: ReactNode;
}

const GuardBlock: React.FC<GuardBlockProps> = ({
  requiredUserType,
  requiredPrivileges = [],
  children,
}) => {
  // Fetch user data (including permissions) via React Query.
  const me = useMe();

  // Display a loading indicator while loading user.
  if (me.state === 'loading') {
    return <div>Loading...</div>;
  }

  // If loading the user fails, or there is no user, redirect to login
  if (me.state === 'error' || me.state === 'logged-out') {
    redirect('/auth/login');
  }

  // Privileges of current user
  const userPrivileges: Privilege[] = me.me.privileges;

  // Check if the user has any required privileges.
  const hasPermissions =
    requiredPrivileges.length === 0 ||
    requiredPrivileges.some((privilege) => userPrivileges.includes(privilege));

  // If the user lacks the required privileges, redirect them outside.
  if (!hasPermissions) {
    redirect('/');
  }

  if (requiredUserType && requiredUserType !== me.type) {
    if (me.type === 'client') {
      redirect('/c/');
    } else {
      redirect('/e/');
    }
  }

  if (me.type === 'client' && !me.me.has2FA) redirect('/c/onboarding');

  return <>{children}</>;
};

export default GuardBlock;
