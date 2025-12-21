import { getServerSession } from "next-auth";
import NaverProvider from "next-auth/providers/naver";
import type { NextAuthOptions } from "next-auth";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export const authOptions: NextAuthOptions = {
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      // 최초 로그인 시에만 백엔드에서 토큰 발급
      if (account) {
        try {
          const res = await fetch(`${BACKEND_URL}/api/auth/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ naverId: account.providerAccountId }),
          });

          if (res.ok) {
            const { data } = await res.json();
            token.accessToken = data.accessToken;
          }
        } catch (error) {
          console.error("Failed to get access token from backend:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export async function auth() {
  return getServerSession(authOptions);
}
