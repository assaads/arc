'use client'

import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const buttonStyles = "px-4 py-2 rounded disabled:opacity-50";
const signInStyles = cn(buttonStyles, "bg-blue-500 text-white hover:bg-blue-600");
const signOutStyles = cn(buttonStyles, "bg-red-500 text-white hover:bg-red-600");

export function AuthButtons() {
  return (
    <div className="flex gap-4">
      <SignedIn>
        <SignOutButton>
          <button className={signOutStyles}>
            Sign Out
          </button>
        </SignOutButton>
      </SignedIn>
      
      <SignedOut>
        <SignInButton mode="modal">
          <button className={signInStyles}>
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
