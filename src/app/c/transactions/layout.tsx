import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    /* I don't like this.  */
    <Suspense>{children}</Suspense>
  );
}
