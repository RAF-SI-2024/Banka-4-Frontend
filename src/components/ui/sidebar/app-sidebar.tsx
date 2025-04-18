'use client';

import { Landmark } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

import { NavMain } from '@/components/ui/sidebar/nav-main-sidebar';
import { HeaderSidebar } from './header-sidebar';
import { FooterSidebar } from './footer-sidebar';
import { useAuth } from '@/context/AuthContext';
import { useMe } from '@/hooks/use-me';
import { isValidPrivilege, Privilege } from '@/types/privileges';
import { SidebarData } from '@/types/sidebar';
import { ALL_GROUPS } from '@/ui/sidebar/entries';
import { filterSidebarItemsByPrivileges } from '@/lib/sidebar-utils';
import { useRouter } from 'next/navigation';

const data: SidebarData = {
  teams: [
    {
      name: 'RAFeisen Bank',
      logo: Landmark,
      url: '/',
    },
  ],
  navMain: ALL_GROUPS,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const auth = useAuth();
  const me = useMe();
  const router = useRouter();

  const onLogout = () => {
    if (auth.isLoggedIn) {
      auth.logout();
    }
  };

  const onProfileClick = () => {
    if (me.state === 'logged-in' && me.type === 'client') {
      router.push('/c/profile');
    }
  };

  const userPrivileges: Privilege[] =
    me.state === 'logged-in' ? me.me.privileges.filter(isValidPrivilege) : [];

  const userType = me.state === 'logged-in' ? me.type : undefined;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <HeaderSidebar teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={filterSidebarItemsByPrivileges(
            data.navMain.filter(
              (g) =>
                userType !== undefined &&
                (userType === g.userType || g.userType === 'any')
            ),
            userPrivileges
          )}
        />
      </SidebarContent>
      {me.state === 'logged-in' && (
        <SidebarFooter>
          <FooterSidebar
            onProfileAction={onProfileClick}
            onLogoutAction={onLogout}
            user={{
              name: me.me.firstName,
              email: me.me.email,
              avatar: '',
            }}
          />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}

// items={filterSidebarItemsByPrivileges(
//       data.navMain.filter(
//       (g) => userType !== undefined && userType === g.userType
//   ),
//   userPrivileges
// )}
