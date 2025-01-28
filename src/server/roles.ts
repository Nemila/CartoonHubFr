"use server";
import { Roles } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";

export const checkRole = async (role: Roles | Roles[]) => {
  const { sessionClaims } = await auth();
  return Array.isArray(role)
    ? role.includes(sessionClaims?.metadata?.role as Roles)
    : sessionClaims?.metadata.role === role;
};
