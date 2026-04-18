import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      // user is only available on the first sign in (login/signup)
      if (user) {
        token.id = user.id;
        // Add other user properties to token if needed for session callback
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        // Fetch full user data from DB to ensure latest info, especially for createdAt/updatedAt
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        });
        if (dbUser) {
          session.user.createdAt = dbUser.createdAt.toISOString();
          session.user.updatedAt = dbUser.updatedAt.toISOString();
          session.user.status = dbUser.status;
          session.user.phoneNumber = dbUser.phoneNumber || undefined;
          session.user.membership = dbUser.status === "ACTIVE" ? "Premium" : "Standard";
        }
      }
      return session;
    },
  },
};
