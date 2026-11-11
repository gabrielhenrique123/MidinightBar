
import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,

      issuer: "https://discord.com",

      authorization: {
        params: {
          scope: "identify",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "discord") {
        token.discordId = account.providerAccountId;
      }

      return token;
    },

    async session({ session, token }) {
      (session as typeof session & { discordId?: string }).discordId =
        typeof token.discordId === "string"
          ? token.discordId
          : undefined;

      return session;
    },
  },
};
