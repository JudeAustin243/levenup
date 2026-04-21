import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "parent-login",
      name: "Parent Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || user.role !== "parent") return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: "parent" as const,
          activeChildId: null,
        };
      },
    }),
    Credentials({
      id: "child-login",
      name: "Child Login",
      credentials: {
        childId: { label: "Child ID", type: "text" },
        pin: { label: "PIN", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.childId || !credentials?.pin) return null;

        const child = await prisma.child.findUnique({
          where: { id: credentials.childId as string },
          include: { parent: true },
        });

        if (!child) return null;

        const isValid = await bcrypt.compare(
          credentials.pin as string,
          child.pinHash
        );

        if (!isValid) return null;

        return {
          id: child.parentId,
          name: child.name,
          email: child.parent.email,
          role: "child" as const,
          activeChildId: child.id,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as any).role;
        token.activeChildId = (user as any).activeChildId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).activeChildId = token.activeChildId;
      }
      return session;
    },
  },
});
