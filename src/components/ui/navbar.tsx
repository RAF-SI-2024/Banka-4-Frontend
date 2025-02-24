"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun, Landmark } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {theme === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function NavigationMenuDemo() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center w-[142px] h-[32px] space-x-[10px]">
            <div className="h-[32px] w-[32px] flex items-center justify-center bg-[#0F172A] rounded-[8px] p-2 border border-white">
              <Landmark className="h-16 w-16 text-white" />
            </div>
            <span className="font-sans font-medium text-sm leading-5 tracking-[0%]">RAFeisen Bank</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList className="hidden md:flex">
                <NavigationMenuItem>
                  <div className="w-[300px] h-[40px] gap-1 border-r-[1px] flex items-center">
                      <NavigationMenuLink href="#" className="px-4 py-2 w-[110px] h-[40px] min-h-[40px] rounded-[6px] gap-0 pt-2 pr-4 pb-2 pl-4">
                        Login Now
                      </NavigationMenuLink>
                    
                      <NavigationMenuLink href="#" className="px-4 py-2 w-[180px] h-[40px] min-h-[40px] rounded-[6px] gap-0 pt-2 pr-4 pb-2 pl-4">
                        Create your Account
                      </NavigationMenuLink>
                  </div>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <ModeToggle />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}


