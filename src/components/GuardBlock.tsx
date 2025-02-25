import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';

// TODO: Replace the type with a correct type
type Permission = string;

interface GuardBlockProps {
  requiredPermissions: Permission[];
  children: ReactNode;
}

const GuardBlock: React.FC<GuardBlockProps> = ({
  requiredPermissions,
  children,
}) => {
  // TODO: no auth context providing user permissions
  const userPermissions: Permission[] = []; //useAuth();

  // Check if the user has all the required permissions
  const hasPermissions = requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );

  // TODO: Just redirect or show a page with a message?
  if (!hasPermissions) {
    return redirect('/');
  }

  return <>{children}</>;
};

export default GuardBlock;
