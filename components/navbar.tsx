"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { NavbarMobileMenu } from "@/components/navbar-mobile-menu";
import { NavbarRoleMenu } from "@/components/navbar-role-menu";
import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard, ReceiptText } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useTransactionsSync } from "@/hooks/use-transactions-sync";

export function Navbar() {
  const { user, accessToken, isLoading, signOut } = useSupabaseAuth();
  const pathname = usePathname();
  const router = useRouter();
  const homeHref = user ? "/home" : "/";
  const isHomeActive = pathname === homeHref;

  useTransactionsSync({ accessToken, isAuthLoading: isLoading });

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-8">
        <span className="font-bold text-xl tracking-tight">FinDash.</span>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2">
          <Link href={homeHref}>
            <Button variant={isHomeActive ? "secondary" : "ghost"} size="sm">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              size="sm"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/transactions">
            <Button
              variant={pathname === "/transactions" ? "secondary" : "ghost"}
              size="sm"
            >
              <ReceiptText className="w-4 h-4 mr-2" />
              Transactions
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <NavbarRoleMenu />
        </div>
        <ThemeToggleButton />
        <NavbarMobileMenu
          pathname={pathname}
          homeHref={homeHref}
          userEmail={user?.email}
          onSignOut={() => {
            void signOut().then((result) => {
              if (!result.error) {
                router.replace("/");
              }
            });
          }}
        />

        <div className="hidden md:block">
          {!user ? (
            <AuthDialog triggerLabel="Login / Sign up" mode="signin" />
          ) : null}
        </div>
      </div>
    </nav>
  );
}
