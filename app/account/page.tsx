"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { AccountNavigation } from "@/components/account-navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useUpdateAccountMutation,
  useAuthDispatch,
} from "@/lib/features/auth/authHook";

export default function AccountPage() {
  const router = useRouter();

  // Profile state
  const [username, setUsername] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [
    updateAccount,
    {
      isError: isAccountError,
      isSuccess: isAccountSuccess,
      isLoading: isAccountLoading,
    },
  ] = useUpdateAccountMutation();

  const [
    updatePassword,
    {
      isError: isPasswordError,
      isSuccess: isPasswordSuccess,
      isLoading: isPasswordLoading,
    },
  ] = useUpdateAccountMutation();

  const authDispatch = useAuthDispatch();

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateAccount({ username })
        .catch((error) => {
          throw error;
        })
        .then((res) => {
          if (res?.error) {
            throw new Error("");
          }

          authDispatch.setUser({ username });
        });
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      await updatePassword({ password: newPassword, currentPassword })
        .then((res) => {
          if (res?.error) {
            throw new Error("");
          }
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordError("Failed to update password");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Sancaka
          </Link>
          <ModeToggle />
        </div>
      </header>
      <AccountNavigation />
      <main className="container py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAccountSubmit} className="space-y-4">
                {isAccountSuccess && (
                  <Alert className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Profile updated successfully
                    </AlertDescription>
                  </Alert>
                )}

                {isAccountError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Profile failed to updated
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" disabled={isAccountLoading}>
                  {isAccountLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {isPasswordSuccess && (
                  <Alert className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Password updated successfully
                    </AlertDescription>
                  </Alert>
                )}

                {isPasswordError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-new-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" disabled={isPasswordLoading}>
                  {isPasswordLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
