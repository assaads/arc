'use client'

import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  return (
    <div className="flex gap-4">
      <SignedIn>
        <SignOutButton>
          <Button variant="destructive">Sign Out</Button>
        </SignOutButton>
      </SignedIn>
      
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign in / Sign up</Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
