"use client";

import { LogOut, User } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavbarRoleMenu() {
  const { user, signOut } = useSupabaseAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="max-w-56 gap-2 shadow-xs hover:shadow-sm"
          title={user?.email ?? "Account"}
        >
          <User className="h-4 w-4 text-blue-500" />
          <span className="truncate">{user?.email ?? "Account"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={6}
        className="origin-top-right data-open:animate-none data-closed:animate-none min-w-64"
      >
        <DropdownMenuItem disabled>
          <User className="mr-2 h-4 w-4" />
          <span
            className="max-w-48 truncate"
            title={user?.email ?? "Not signed in"}
          >
            {user?.email ?? "Not signed in"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          {user ? "Signed in" : "Signed out"}
        </DropdownMenuItem>
        {user ? (
          <DropdownMenuItem onClick={() => void signOut()}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
