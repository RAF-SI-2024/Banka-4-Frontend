import { SidebarGroupType } from '@/types/sidebar';
import {
  ArrowRightLeft,
  BriefcaseBusiness,
  Coins,
  HandCoins,
  Home,
  List,
  Nfc,
  Plus,
  UserPlus,
  Users,
  CircleDollarSign,
} from 'lucide-react';

const ClientGroups: SidebarGroupType[] = [
  {
    title: 'Home',
    url: '/c',
    icon: Home,
    isActive: false,
    userType: 'client',
    items: undefined,
  },
  {
    title: 'Transactions',
    url: '/c/transactions',
    icon: ArrowRightLeft,
    isActive: false,
    userType: 'client',
    items: [
      {
        title: 'Overview',
        url: '/c/transactions',
        icon: List,
        privileges: [],
      },
      {
        title: 'New Payment',
        url: '/c/transactions/new-payment',
        icon: Nfc,
        privileges: [],
      },
      {
        title: 'New Transfer',
        url: '/c/transactions/transfer',
        icon: HandCoins,
        privileges: [],
      },
    ],
  },
  {
    title: 'Loans',
    url: '/c/loans',
    icon: HandCoins,
    isActive: false,
    userType: 'client',
    items: [
      {
        title: 'Overview',
        url: '/c/loans',
        icon: List,
        privileges: [],
      },
    ],
  },
  {
    title: 'Contacts',
    url: '/c/contacts',
    icon: Users,
    isActive: false,
    userType: 'client',
    items: [
      {
        title: 'Manage',
        url: '/c/contacts',
        icon: List,
        privileges: [],
      },
    ],
  },
];

const EmployeeGroups: SidebarGroupType[] = [
  {
    title: 'Home',
    url: '/e',
    icon: Home,
    isActive: false,
    userType: 'employee',
    items: undefined,
  },
  {
    title: 'Accounts',
    url: '/e/accounts',
    icon: Coins,
    isActive: false,
    userType: 'employee',
    items: [
      {
        title: 'Overview',
        url: '/e/accounts',
        icon: List,
        privileges: [],
      },
      {
        title: 'New',
        url: '/e/accounts/new',
        icon: Plus,
        privileges: [],
      },
    ],
  },
  {
    title: 'Clients',
    url: '/e/client',
    icon: Users,
    isActive: false,
    userType: 'employee',
    items: [
      {
        title: 'Overview',
        url: '/e/client',
        icon: List,
        privileges: [],
      },
    ],
  },
  {
    title: 'Employees',
    url: '/e/employee',
    icon: BriefcaseBusiness,
    isActive: false,
    userType: 'employee',
    items: [
      {
        title: 'Overview',
        url: '/e/employee',
        icon: List,
        privileges: ['ADMIN'],
      },
      {
        title: 'New',
        url: '/e/employee/new',
        icon: UserPlus,
        privileges: ['ADMIN'],
      },
    ],
  },
  {
    title: 'Loans',
    url: '/e',
    icon: CircleDollarSign,
    isActive: false,
    userType: 'employee',
    items: [
      {
        title: 'Overview',
        url: '/e/loans',
        icon: List,
        privileges: [],
      },
    ],
  },
];

export const ALL_GROUPS = EmployeeGroups.concat(ClientGroups);
