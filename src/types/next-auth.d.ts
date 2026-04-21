import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "parent" | "child";
      activeChildId: string | null;
    };
  }

  interface User {
    role: "parent" | "child";
    activeChildId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "parent" | "child";
    activeChildId: string | null;
  }
}
