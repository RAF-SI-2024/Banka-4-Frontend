'use client';

import {
  ChevronsUpDown,
  LogOut,
  Monitor,
  Moon,
  Shuffle,
  Sun,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useTheme } from 'next-themes';
import { ALL_PALETTE_TYPES, usePalette } from '@/hooks/use-palette';
import { cn } from '@/lib/utils';

export function FooterSidebar({
  user,
  onLogoutAction,
  onProfileAction,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onProfileAction: () => void;
  onLogoutAction: () => void;
}) {
  const { isMobile } = useSidebar();
  const theme = useTheme();
  const { palette, setPalette } = usePalette();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              id={'sidebar-me'}
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem
              onClick={onProfileAction}
              className="p-0 font-normal cursor-pointer"
            >
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className={'overflow-y-auto h-96'}>
              {ALL_PALETTE_TYPES.map((p) => (
                <DropdownMenuItem
                  className={cn(
                    'cursor-pointer',
                    palette === p ? 'bg-background' : ''
                  )}
                  key={p}
                  onClick={() => setPalette(p)}
                >
                  {p === 'random' && <Shuffle />}
                  {p
                    .replaceAll('-', ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={'cursor-pointer'}
              onClick={() => {
                theme.setTheme('light');
              }}
            >
              <Sun />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem
              className={'cursor-pointer'}
              onClick={() => {
                theme.setTheme('dark');
              }}
            >
              <Moon />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem
              className={'cursor-pointer'}
              onClick={() => {
                theme.setTheme('system');
              }}
            >
              <Monitor />
              System
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              id={'sidebar-logout'}
              className={'cursor-pointer'}
              onClick={onLogoutAction}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
