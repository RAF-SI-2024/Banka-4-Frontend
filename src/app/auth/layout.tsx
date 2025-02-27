import { AppNavigationMenu } from '@/components/ui/navbar';

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNavigationMenu />
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
    </>
  );
}
