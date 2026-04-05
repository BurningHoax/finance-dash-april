"use client";

import Link from "next/link";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Home, LayoutDashboard, Menu, ReceiptText } from "lucide-react";

type NavbarMobileMenuProps = {
  pathname: string;
  userEmail: string | undefined;
  onSignOut: () => void;
};

export function NavbarMobileMenu({
  pathname,
  userEmail,
  onSignOut,
}: NavbarMobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <div className="px-4 pt-4">
          <SheetTitle>Navigation</SheetTitle>
        </div>
        <div className="px-4 pb-4">
          <div className="grid gap-2">
            <SheetClose asChild>
              <Link href="/">
                <Button
                  variant={pathname === "/" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/dashboard">
                <Button
                  variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/transactions">
                <Button
                  variant={pathname === "/transactions" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <ReceiptText className="mr-2 h-4 w-4" />
                  Transactions
                </Button>
              </Link>
            </SheetClose>
          </div>

          <div className="mt-4 border-t pt-4">
            {userEmail ? (
              <div className="space-y-2">
                <p
                  className="truncate text-sm text-muted-foreground"
                  title={userEmail}
                >
                  {userEmail}
                </p>
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onSignOut}
                  >
                    Logout
                  </Button>
                </SheetClose>
              </div>
            ) : (
              <AuthDialog triggerLabel="Login / Sign up" mode="signin" />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
