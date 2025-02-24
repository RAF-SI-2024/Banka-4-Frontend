"use client"

//ikonice
import { UserPlus, BriefcaseBusiness, List, Landmark  } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
  } from "@/components/ui/sidebar"

  import { NavMain } from "@/components/ui/sidebar/nav-main-sidebar"
  import { HeaderSidebar } from "./header-sidebar"
  //data za prikaz elemenata u sidebar-u
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "RAFeisen Bank",
        logo: Landmark,
      }
    
    ],
    navMain: [
      {
        title: "Employees",
        url: "#",
        icon: BriefcaseBusiness,
        isActive: true,
        items: [
          {
            title: "Overview",
            url: "#",
            icon: List
          },
          {
            title: "News",
            url: "#",
            icon: UserPlus
          },
        ],
      },
    ],
  }

  export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <HeaderSidebar teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          {/* <NavProjects projects={data.projects} /> */}
        </SidebarContent>
        <SidebarFooter>
          {/* <NavUser user={data.user} /> */}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    )
  }