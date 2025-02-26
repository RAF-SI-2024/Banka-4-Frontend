'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbList,
} from './breadcrumb';

import { useBreadcrumb } from '../../context/BreadcrumbContext';

export function AppBreadcrumb() {
  const { state } = useBreadcrumb();

  return (
    <Breadcrumb>
    <BreadcrumbList>
    {state.items.map((item, index) => (
      <BreadcrumbItem key={index} >
        <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
        {index < state.items.length - 1 && <BreadcrumbSeparator />}
      </BreadcrumbItem>
    ))}
    </BreadcrumbList>
  </Breadcrumb>
  );
}
