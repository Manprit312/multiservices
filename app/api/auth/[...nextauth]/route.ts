/**
 * NextAuth Route Handler
 * 
 * NOTE: This is a thin wrapper for Next.js integration.
 * All actual authentication logic is handled in the backend:
 * - Backend routes: /backend/routes/authRoutes.js
 * - Backend controllers: /backend/controllers/authController.js
 * - Firebase auth: /backend/controllers/firebaseAuthController.js
 * 
 * This route only provides Next.js session management and calls backend APIs.
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Login with backend API
          const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (data.token && data.user) {
            return {
              id: data.user._id || data.user.id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              token: data.token,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: { id?: string; email?: string | null; name?: string | null; image?: string | null; role?: string; token?: string }; account?: { provider: string; providerAccountId: string } | null }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists in backend, if not create them
          const res = await fetch(`${API_BASE}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: account.providerAccountId,
              image: user.image,
            }),
          });

          const data = await res.json();
          if (data.success && data.user) {
            user.id = data.user._id || data.user.id;
            user.role = data.user.role;
            user.token = data.token;
          }
        } catch (error) {
          console.error("Google auth error:", error);
        }
      }
      return true;
    },
    async jwt({ token, user }: { token: { id?: string; role?: string; accessToken?: string }; user?: { id?: string; role?: string; token?: string } }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = (user as { token?: string }).token;
      }
      return token;
    },
    async session({ session, token }: { session: { user?: { id?: string; role?: string; name?: string | null; email?: string | null; image?: string | null }; expires: string }; token: { id?: string; role?: string; accessToken?: string } }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
        (session as { accessToken?: string }).accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const { handlers } = NextAuth(authOptions as Parameters<typeof NextAuth>[0]);

export const { GET, POST } = handlers;

