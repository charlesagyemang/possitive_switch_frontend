"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Box,
  Bug,
  Command,
  Frame,
  GalleryVerticalEnd,
  Gauge,
  LayoutGrid,
  Map,
  PartyPopper,
  PartyPopperIcon,
  PieChart,
  Plus,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "../../ui/button";
import useModal from "../modal/useModal";
import TestableChechkList from "@/app/admin/testables/testable-checklist";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: Gauge,
      isActive: true,
    },
    {
      title: "Testables",
      icon: Box,
      isActive: true,
      items: [
        {
          title: "Create New",
          url: "/admin/testables/new",
          icon: Plus,
        },
        {
          title: "All Testables",
          url: "/admin/testables",
          icon: SquareTerminal,
        },
      ],
    },
    // {
    //   title: "Sessions",
    //   icon: Bug,
    //   items: [
    //     {
    //       title: "New Party",
    //       url: "#",
    //       icon:PartyPopperIcon,
    //     },
    //     {
    //       title: "All Sessions",
    //       url: "/admin/sessions",
    //       icon: 
          
    //     },
    //   ],
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },

    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

  const { ModalPortal, open: openModal, close } = useModal();
  return (
    <Sidebar collapsible="icon" {...props}>
      <ModalPortal />
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <div className="flex flex-row items-center sm:px-5  justify-center">
          <Button
            onClick={() =>
              openModal(
                <TestableChechkList close={close} />,
                "Before You Start A Bug Bash"
              )
            }
            className="w-full"
            variant="outline"
          >
            <Bug />{" "}
            <span className={open ? "" : "hidden"}>Start A Bug Bash</span>
          </Button>
        </div>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
