'use client'

import { useAuth, useSignIn, useClerk } from "@clerk/nextjs";
import { useTransition } from "react";
import { signInAction, signOutAction } from "@/lib/auth-actions";

export function AuthButtons() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { signIn } = useSignIn();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = async () => {
    try {
      startTransition(async () => {
        // First call our server action
        await signOutAction();
        // Then use Clerk's signOut
        await signOut();
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSignIn = async () => {
    try {
      startTransition(async () => {
        if (!signIn) return;
        
        // First use Clerk's signIn
        await signIn.create({
          strategy: "oauth_google",
          redirectUrl: "/dashboard",
        });
        // Then call our server action
        await signInAction();
      });
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="flex gap-4">
      {isSignedIn ? (
        <button
          onClick={handleSignOut}
          disabled={isPending}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {isPending ? "Signing out..." : "Sign Out"}
        </button>
      ) : (
        <button
          onClick={handleSignIn}
          disabled={isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      )}
    </div>
  );
}
