'use client';

import { UserPlus, BriefcaseBusiness, List, Landmark } from 'lucide-react';

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

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
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
          url: '/employee/overview',
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <HeaderSidebar teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <FooterSidebar user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
