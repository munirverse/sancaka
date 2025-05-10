"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthDispatch } from "@/lib/features/auth/authHook";
import { useLogoutMutation } from "@/lib/features/auth/authHook";

export default function LogoutPage() {
  const router = useRouter();
  const authDispatch = useAuthDispatch();
  const [logout] = useLogoutMutation();

  setTimeout(async () => {
    authDispatch.setIsAuthenticated(false);
    authDispatch.setUser(null);
    authDispatch.setToken(null);

    await logout();

    router.push("/");
  }, 500);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <h1 className="text-2xl font-bold">Logging out...</h1>
        <p className="text-muted-foreground">
          Please wait while we securely log you out.
        </p>
      </div>
    </div>
  );
}
