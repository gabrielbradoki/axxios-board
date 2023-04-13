import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { db } from "../../../services/firebaseConnection";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async session({ session, token, user, profile }) {
      // Send properties to the client, like an access_token and user id from a provider.
      try {

        const lastDonate = await db.collection('vip-users').doc(String(token.sub)).get().then((snapshot) => {
          return snapshot.exists ? snapshot.data().lastDonate.toDate() : null;
        })

        session.accessToken = token.accessToken
        return {
          ...session,
          id: token.sub,
          vip: lastDonate ? true : false,
          lastDonate
        }
    } catch {
      return {
        ...session,
        id: null,
        vip: false,
        lastDonate: false

      }
    }
    },

    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true
      try {
        if (isAllowedToSignIn) {
          return true
        }
      } catch (err) {
          console.log('Deu Erro: ' + err);
          return false;
      }
    }
  }
}

export default NextAuth(authOptions)