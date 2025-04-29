'use client';
import { AppNavigationMenu } from '@/components/ui/navbar';
import { usePalette } from '@/hooks/use-palette';

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  usePalette();
  return (
    <>
      <AppNavigationMenu />
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
    </>
  );
}
