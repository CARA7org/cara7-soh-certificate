"use client";
import { ChevronDown, User } from "lucide-react";
import {
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { useWeb3Auth } from "@/context/web3auth";
import { useUserInfo } from "@/hooks/web3/useUserInfo";

export function HeaderSidebar() {
  const { loggedIn, logout, login } = useWeb3Auth();
  const { userInfo, userInfoStatus } = useUserInfo();

  if (!loggedIn) {
    return (
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={login}>
            <User />
            login
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
    );
  }

  if (userInfoStatus === "loading") {
    return (
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <User />
            Loading...
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
    );
  }

  return (
    <SidebarHeader>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <User />
              {userInfo?.verifierId}
              <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
            <DropdownMenuItem>
              <SidebarMenuButton onClick={logout} asChild>
                <span>Sign out</span>
              </SidebarMenuButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarHeader>
  );
}
