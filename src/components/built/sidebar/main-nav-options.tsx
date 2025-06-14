"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useURLOptions } from "@/hooks/use-url-options";
import Link from "next/link";

export function CustomNavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      icon?: LucideIcon;
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { pathname } = useURLOptions();
  const Icon = ({ icon }: { icon?: LucideIcon }) => {
    if (!icon) return null;
    const IconComponent = icon;
    return <IconComponent className="h-4 w-4" />;
  };
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Manage </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              isActive={item.url === pathname}
              tooltip={item.title}
              asChild={!!item.url && !item.items}
            >
              {/* {item.icon && <item.icon />} */}
              {item.url && !item.items ? (
                <Link href={item.url}>
                  <Icon icon={item.icon} />
                  <span>{item.title}</span>
                </Link>
              ) : (
                <span className="flex items-center gap-2">
                  <Icon icon={item.icon} />
                  {item.title}
                </span>
              )}
            </SidebarMenuButton>
            {item.items && item.items.length > 0 && (
              <SidebarMenuSub>
                {item.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild>
                      <Link href={subItem.url}>
                        {subItem.icon && <subItem.icon />}{" "}
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
