'use client';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useEffect } from 'react';
import GuardBlock from '@/components/GuardBlock';

export default function EmployeeHomePage() {
  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [{ title: 'Home' }],
    });
  }, [dispatch]);

  return (
    <GuardBlock requiredUserType={'employee'}>
      <h1>Hi!</h1>{' '}
    </GuardBlock>
  );
}
