"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, ReceiptText, ShieldAlert, User } from "lucide-react";

export function Navbar() {
  const { role, setRole } = useStore();
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background h-16 flex items-center px-4 md:px-8 justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <span className="font-bold text-xl tracking-tight">FinanceDash.</span>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2">
          <Link href="/">
            <Button variant={pathname === "/" ? "secondary" : "ghost"} size="sm">
              <LayoutDashboard className="w-4 h-4 mr-2" /> 
              Overview
            </Button>
          </Link>
          <Link href="/transactions">
            <Button variant={pathname === "/transactions" ? "secondary" : "ghost"} size="sm">
              <ReceiptText className="w-4 h-4 mr-2" /> 
              Transactions
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Role Switcher - Fulfills Core Requirement 3 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {role === 'admin' ? (
                <ShieldAlert className="w-4 h-4 text-rose-500" />
              ) : (
                <User className="w-4 h-4 text-blue-500" />
              )}
              Role: {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setRole('viewer')}>
              <User className="w-4 h-4 mr-2" /> Viewer (Read-only)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole('admin')}>
              <ShieldAlert className="w-4 h-4 mr-2" /> Admin (Edit access)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}