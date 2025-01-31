'use server'

import { currentUser } from "@clerk/nextjs/server";

export async function checkAdminStatus(): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;
  
  return user.publicMetadata?.role === 'admin';
}
