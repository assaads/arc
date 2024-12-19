'use server'

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function signInAction() {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }
  
  // Add any additional sign in logic here
  return { success: true };
}

export async function signOutAction() {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }
  
  // Add any additional sign out logic here
  return { success: true };
}

// Helper function to check authentication
export async function checkAuth() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  return userId;
}
