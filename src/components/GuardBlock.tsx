'use client';

import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useHttpClient } from '@/context/HttpClientContext';
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
  const auth = useAuth();

  const httpClient = useHttpClient();

  // Fetch user data (including permissions) via React Query.
  const { data, isLoading, error } = useMe(httpClient);

  /*
      useEffect(() => {
          console.log("Loading: " + auth.isLoading)
          console.log("LoggedIn: " + auth.isLoggedIn);
      }, [auth]);*/

  // If auth is not processed yet, show loading
  if (auth.isLoading) return <div>Loading...</div>;

  // If the user is not logged in, redirect to login.
  if (!auth.isLoggedIn) {
    redirect('/auth/login');
  }

  // Display a loading indicator while loading user.
  if (isLoading) {
    return <div>Loading user...</div>;
  }

  // If loading user fails, redirect to login
  if (error) {
    redirect('/auth/login');
  }

  // Privileges of current user
  const userPrivileges: Privilege[] = data?.privileges || [];

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
