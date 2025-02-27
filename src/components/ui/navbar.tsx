'use client';

import * as React from 'react';
import { Landmark } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import { ModeToggle } from '@/components/ui/mode-toggle';

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
