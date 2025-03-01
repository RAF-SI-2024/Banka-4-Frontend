'use client';

import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Privilege } from '@/types/privileges';
import { useMe } from '@/hooks/use-me';

interface GuardBlockProps {
  requiredPrivileges: Privilege[];
  children: ReactNode;
}

const GuardBlock: React.FC<GuardBlockProps> = ({
  requiredPrivileges,
  children,
}) => {
  // Fetch user data (including permissions) via React Query.
  const me = useMe();

  /*
      useEffect(() => {
          console.log("Loading: " + auth.isLoading)
          console.log("LoggedIn: " + auth.isLoggedIn);
      }, [auth]);*/

  // Display a loading indicator while loading user.
  if (me.state === 'loading') {
    return <div>Loading...</div>;
  }

  // If loading the user fails, or there is no user, redirect to login
  if (me.state === 'error' || me.state === 'logged-out') {
    redirect('/auth/login');
  }

  // Privileges of current user
  const userPrivileges = me.me.privileges;

  // Check if the user has all required privileges.
  const hasPermissions = requiredPrivileges.every((privilege) =>
    userPrivileges.includes(privilege)
  );

  // If the user lacks the required privileges, redirect them outside.
  if (!hasPermissions) {
    redirect('/');
  }

  return <>{children}</>;
};

export default GuardBlock;
