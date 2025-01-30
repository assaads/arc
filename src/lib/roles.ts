import { currentUser } from "@clerk/nextjs/server";
import type { UserResource } from "@clerk/types";

export type Role = 'admin' | 'user';

export async function hasRole(role: Role): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;
  
  return user.publicMetadata?.role === role;
}

export async function setUserRole(userId: string, role: Role) {
  const res = await fetch(`/api/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role }),
  });

  if (!res.ok) {
    throw new Error('Failed to update user role');
  }
}

export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}

export function getRoleFromMetadata(user: UserResource | null): Role {
  if (!user) return 'user';
  return (user.publicMetadata?.role as Role) || 'user';
}
