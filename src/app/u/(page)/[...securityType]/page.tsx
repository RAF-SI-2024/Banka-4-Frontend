'use client';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { isValidSecurityType } from '../isValidSecurityType';

export default function Page({
  params,
}: {
  params: Promise<{ securityType: string[] }>;
}) {
  const { securityType: securityTypeParam } = use(params);
  const [securityType, id] = securityTypeParam;

  if (!id || !securityType || !isValidSecurityType(securityType))
    return notFound();

  // TODO: implement "Detaljan prikaz hartije"
  return <div></div>;
}
