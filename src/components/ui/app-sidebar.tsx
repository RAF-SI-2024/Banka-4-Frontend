//ikonice
import { UserPlus, BriefcaseBusiness, List, Landmark  } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"

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