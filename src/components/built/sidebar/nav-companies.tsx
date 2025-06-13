"use client";

import { Landmark, Lock, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

} from "@/components/ui/sidebar";
import { useURLOptions } from "@/hooks/use-url-options";

export function NavCompanies({
  companies,
}: {
  companies: {
    name: string;
    url: string;
    icon: LucideIcon;
    locked?: boolean;
  }[];
}) {

  const { pathname } = useURLOptions();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="">Companies</SidebarGroupLabel>
      <SidebarMenu>
        {companies.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton isActive={item.url === pathname} asChild>
              <a href={item.url}>
                {/* <item.icon />  */}
                <Landmark className="" />
                <span className="truncate">{item.name}</span>

                {/* {item.locked && (
                  <Lock className="ml-auto text-sidebar-foreground/40" />
                )} */}
              </a>
            </SidebarMenuButton>
            {item.locked && (
              <Lock className="absolute right-2 top-2 h-4 w-4 text-gray-300" />
            )}
          </SidebarMenuItem>
        ))}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  );
}
