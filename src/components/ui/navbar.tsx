'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Landmark, Monitor, Moon, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

function ModeToggle() {
  const { setTheme, theme, systemTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {theme === 'light' ? (
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          ) : theme === 'dark' ? (
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          ) : systemTheme === 'dark' ? (
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppNavigationMenu() {
  return (
    <div className="border-b w-full">
      <div className="flex items-center justify-between py-3 px-4 md:px-6">
        <div className="flex items-center space-x-[10px]">
          <div className="size-9 flex items-center justify-center bg-slate-900 dark:bg-zinc-950 rounded-lg p-2">
            <Landmark className="size-5 text-white" />
          </div>
          <span className="font-sans font-medium text-lg leading-5 tracking-[0%]">
            RAFeisen Bank
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/auth/login" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Login Now
                  </NavigationMenuLink>
                </Link>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Create your Account
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="h-6 border-l border-gray-300"></div>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
