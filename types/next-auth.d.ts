import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      createdAt?: string; // Add createdAt as string (from toISOString)
      updatedAt?: string; // Add updatedAt as string (from toISOString)
      status?: "ACTIVE" | "INACTIVE" | "BANNED"; // Add status
      phoneNumber?: string;
      membership?: "Standard" | "Premium" | "VIP";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    createdAt?: Date; // Prisma returns Date objects
    updatedAt?: Date; // Prisma returns Date objects
    status?: "ACTIVE" | "INACTIVE" | "BANNED";
    phoneNumber?: string;
    image?: string;
    membership?: "Standard" | "Premium" | "VIP";
    password?: string; // For credentials provider, though not exposed in session
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    createdAt?: string;
    updatedAt?: string;
    status?: "ACTIVE" | "INACTIVE" | "BANNED";
    phoneNumber?: string;
    membership?: "Standard" | "Premium" | "VIP";
  }
}
