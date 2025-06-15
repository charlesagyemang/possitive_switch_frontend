"use client";

import * as React from "react";
import {
  AlarmClockCheck,
  GalleryVerticalEnd,
  Layout,
  PieChart,
  RectangleGoggles,
} from "lucide-react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { CustomNavMain } from "./main-nav-options";
import { CustomNavProject } from "./nav-projects";
import { NavCompanies } from "./nav-companies";

// This is sample data.
const data = {
  user: {
    name: "Mr. Frimpong",
    email: "m@bbsoft.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Microsoft Inc",
      logo: GalleryVerticalEnd,
      plan: "Super Admin",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/sa/dashboard",
      icon: Layout,
      isActive: true,
    },
  ],
  companies: [
    {
      name: "New Fire Media",
      url: "/c/new-fire-media",
      icon: RectangleGoggles,
    },
    {
      name: "MazelTov Group",
      url: "#",
      icon: PieChart,
      locked: true,
    },
    {
      name: "Biibisoft Ltd",
      url: "#",
      icon: AlarmClockCheck,
      locked: true,
    },
  ],
  projects: [
    {
      name: "VR OnBoarding",
      url: "#",
      icon: RectangleGoggles,
    },
    {
      name: "Recruiter's Lounge",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Countdown Mailer",
      url: "#",
      icon: AlarmClockCheck,
    },
  ],
};

export function SuperAdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="shadow-xs shadow-violet-200"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <div className="flex items-center gap-3 py-1">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold">Microsoft Inc</span>
            <span className="truncate text-xs">Super Admin</span>
          </div>
        </div>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <CustomNavMain items={data.navMain} />
        <NavCompanies companies={data.companies} />
        <CustomNavProject projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
