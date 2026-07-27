"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button variant="ghost" size="sm" disabled>
        <span className="h-4 w-4 animate-pulse rounded-full bg-gray-300" />
      </Button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt=""
            className="h-6 w-6 rounded-full"
          />
        )}
        <span className="text-sm hidden sm:inline">
          {session.user?.name || session.user?.email}
        </span>
        <Button variant="ghost" size="sm" onClick={() => signOut()}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={() => signIn("google")}>
      <LogIn className="mr-1 h-4 w-4" />
      Sign in
    </Button>
  );
}
