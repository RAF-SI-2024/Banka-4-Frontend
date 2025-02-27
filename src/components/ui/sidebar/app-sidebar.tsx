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
        },
        {
          title: 'New',
          url: '/employee/new',
          icon: UserPlus,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const queryClient = useQueryClient();
  const httpClient = useHttpClient();
  const auth = useAuth();
  const me = useMe(httpClient);

  const onLogout = () => {
    if (auth.isLoggedIn) {
      auth.logout();
      queryClient.invalidateQueries({
        queryKey: ['employee', 'me'],
      });
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <HeaderSidebar teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {me.isSuccess && (
        <SidebarFooter>
          <FooterSidebar
            onLogoutAction={onLogout}
            user={{
              name: me.data.username,
              email: me.data.email,
              avatar: '',
            }}
          />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
