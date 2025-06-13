import React from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

function NavigationLayout() {
  return (
    <div className="w-full bg-gradient-to-r from-primary/15 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="w-full flex items-center shadow-sm gap-6 px-6 py-4  bg-opacity-90 border-none border-gray-200 dark:border-gray-800 backdrop-blur-md">
        <SidebarTrigger className="-ml-1 hover:scale-110 transition-transform duration-200" />

        <Separator
          orientation="vertical"
          className="mr-4 data-[orientation=vertical]:h-6"
        />

        {/* Search Input */}
        <div className="flex-1 relative">
          <Input
            type="search"
            placeholder="Search companies, candidates, employees..."
            className="w-full border-0 text-black  border-primary dark:border-pink-400 shadow-none rounded-sm  focus-visible:ring-2  dark:focus-visible:ring-pink-400 pl-10 transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary dark:text-pink-400 pointer-events-none">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-6 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 px-3  rounded-full bg-gradient-to-r from-indigo-100 to-pink-100 dark:from-gray-800 dark:to-gray-900  hover:scale-105 transition-all duration-200">
                <Avatar className="ring-2 ring-indigo-400 dark:ring-pink-400">
                  <AvatarImage src="/avatar.jpg" alt="User" />
                  <AvatarFallback>MA</AvatarFallback>
                </Avatar>
                {/* <div className="hidden sm:flex flex-col items-start">
                  <span className="font-semibold text-indigo-700 dark:text-pink-300 text-sm tracking-wide">
                    Mr Admin
                  </span>
                  <span className="text-xs text-indigo-400 dark:text-pink-400 font-medium">
                    Super Admin
                  </span>
                </div> */}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[200px] rounded-xl shadow-lg bg-white/95 dark:bg-gray-900/95 border-0"
            >
              <DropdownMenuLabel className="text-indigo-600 dark:text-pink-400">
                Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-indigo-50 dark:hover:bg-pink-900/30 transition">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-indigo-50 dark:hover:bg-pink-900/30 transition">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default NavigationLayout;
