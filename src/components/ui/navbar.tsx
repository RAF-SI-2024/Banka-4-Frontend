'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun, Landmark, Monitor } from 'lucide-react';
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
} from '@/components/ui/navigation-menu';

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
      <div className="flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-[10px]">
          <div className="size-8 flex items-center justify-center bg-[#0F172A] rounded-lg p-2 border border-white">
            <Landmark className="size-4 text-white" />
          </div>
          <span className="font-sans font-medium text-sm leading-5 tracking-[0%]">
            RAFeisen Bank
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList className="hidden md:flex">
              <NavigationMenuItem>
                <div className="gap-1 flex items-center">
                  <NavigationMenuLink
                    href="#"
                    className="px-4 py-2 min-h-[40px] rounded-[6px]"
                  >
                    Login Now
                  </NavigationMenuLink>

                  <NavigationMenuLink
                    href="#"
                    className="px-4 py-2 min-h-[40px] rounded-[6px]"
                  >
                    Create your Account
                  </NavigationMenuLink>
                </div>
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
