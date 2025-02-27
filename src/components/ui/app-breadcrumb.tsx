'use client';

import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from './breadcrumb';

import { useBreadcrumb } from '@/context/BreadcrumbContext';

export function AppBreadcrumb() {
  const { state } = useBreadcrumb();

  const last = state.items.at(-1);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {state.items.slice(0, -1).map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </React.Fragment>
        ))}
        {last && <BreadcrumbItem>{last.title}</BreadcrumbItem>}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
