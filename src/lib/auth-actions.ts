'use server'

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Role } from "../types/clerk";

interface AuthResponse {
  success: boolean;
  message?: string;
}

export async function signInAction(): Promise<AuthResponse> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Authentication required");
    }
    
    const user = await currentUser();
    
    return {
      success: true,
      message: `Signed in as ${user?.emailAddresses[0]?.emailAddress}`
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred during sign in"
    };
  }
}

export async function signOutAction(): Promise<AuthResponse> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    return {
      success: true,
      message: "Successfully signed out"
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred during sign out"
    };
  }
}

// Helper function to check authentication
export async function checkAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  return userId;
}

// Helper function to check admin role
export async function checkAdminRole() {
  const { sessionClaims } = await auth();
  const userRole = sessionClaims?.metadata?.role as Role;
  
  if (userRole !== "admin") {
    redirect("/");
  }
  
  return true;
}
