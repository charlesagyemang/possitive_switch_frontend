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
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  // const { pathname } = useURLOptions();
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="">Companies</SidebarGroupLabel>
      <SidebarMenu>
        {companies.map((item) => {
          // Check if the item is locked
          const isActive = pathname?.includes(item.url) || false;
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton isActive={isActive} asChild>
                <Link href={item.url}>
                  {/* <item.icon />  */}
                  <Landmark className="" />
                  <span className="truncate">{item.name}</span>

                  {/* {item.locked && (
                  <Lock className="ml-auto text-sidebar-foreground/40" />
                )} */}
                </Link>
              </SidebarMenuButton>
              {item.locked && (
                <Lock className="absolute right-2 top-2 h-4 w-4 text-gray-300" />
              )}
            </SidebarMenuItem>
          );
        })}
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
