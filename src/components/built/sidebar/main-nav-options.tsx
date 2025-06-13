"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { useURLOptions } from "@/hooks/user-url-options";

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
                <a href={item.url}>
                  <Icon icon={item.icon} />
                  <span>{item.title}</span>
                </a>
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
                      <a href={subItem.url}>
                        {subItem.icon && <subItem.icon />}{" "}
                        <span>{subItem.title}</span>
                      </a>
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
