'use client';

import { BriefcaseBusiness, Landmark, List, UserPlus } from 'lucide-react';

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
import { useHttpClient } from '@/context/HttpClientContext';
import { useQueryClient } from '@tanstack/react-query';
import { Privilege, isValidPrivilege } from '@/types/privileges';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const auth = useAuth();
  const me = useMe();

  const onLogout = () => {
    if (auth.isLoggedIn) {
      auth.logout();
    }
  };

  const userPrivileges: Privilege[] =
    me.state === 'logged-in' ? me.me.privileges.filter(isValidPrivilege) : [];

  const hasRequiredPrivileges = (requiredPrivileges: Privilege[]) => {
    return requiredPrivileges.every((priv) => userPrivileges.includes(priv));
  };

  const data = {
    teams: [
      {
        name: 'RAFeisen Bank',
        logo: Landmark,
        url: '/',
      },
    ],
    navMain: [
      {
        title: 'Employees',
        url: '/employee',
        icon: BriefcaseBusiness,
        isActive: true,
        items: [
          {
            title: 'Overview',
            url: '/employee',
            icon: List,
            privileges: ['ADMIN', 'SEARCH', 'FILTER'],
          },
          {
            title: 'New',
            url: '/employee/new',
            icon: UserPlus,
            privileges: ['ADMIN', 'CREATE'],
          },
        ],
      },
    ]
      .map((section) => {
        const filteredItems = section.items.filter((item) =>
          hasRequiredPrivileges(item.privileges as Privilege[])
        );

        return filteredItems.length > 0
          ? { ...section, items: filteredItems }
          : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null),
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <HeaderSidebar teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {me.state === 'logged-in' && (
        <SidebarFooter>
          <FooterSidebar
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
