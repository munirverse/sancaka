"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useAuthSelector } from "@/lib/features/auth/authHook";

export function AccountNavigation() {
  const { isAuthenticated, user } = useAuthSelector();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    router.push("/logout");
  };

  return (
    <div className="mt-4">
      <div className="container flex h-12 items-center justify-end">
        {isAuthenticated ? (
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={"https://avatar.vercel.sh/sancaka"}
                    alt={user?.username ?? "User"}
                  />
                  <AvatarFallback>
                    {user?.username.charAt(0).toUpperCase() || "User"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{user?.username || "User"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/account" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 focus:text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
