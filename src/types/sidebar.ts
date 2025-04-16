import { Privilege } from '@/types/privileges';
import { UserType } from '@/api/auth';
import { LucideIcon } from 'lucide-react';

export interface SidebarData {
  teams: SidebarTeam[];
  navMain: SidebarGroupType[];
}

export interface SidebarTeam {
  name: string;
  logo: LucideIcon;
  url: string;
}

export interface SidebarGroupType {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive: boolean;
  items?: SidebarGroupItemType[];
  userType: UserType | 'any';
  privileges: Privilege[];
}

export interface SidebarGroupItemType {
  title: string;
  url: string;
  icon: LucideIcon;
  privileges: Privilege[];
}
