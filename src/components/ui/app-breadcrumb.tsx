'use client';

import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from './breadcrumb';

import { useBreadcrumb } from '../../context/BreadcrumbContext';

export function AppBreadcrumb() {
  const { state } = useBreadcrumb();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {state.items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
            </BreadcrumbItem>
            {index < state.items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
