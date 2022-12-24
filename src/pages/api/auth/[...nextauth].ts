import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { db } from "../../../services/firebaseConnection";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET,
      scope: 'read:user'
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session, token, user, profile }) {
      // Send properties to the client, like an access_token and user id from a provider.
      try {

        const lastDonate = await db.collection('vip-users').doc(String(token.sub)).get().then((snapshot) => {
          if (snapshot.exists){
            return snapshot.data().lastDonate.toDate();
          } else {
            return null;
          }
        })

        session.accessToken = token.accessToken
        return {
          ...session,
          id: token.sub,
          vip: lastDonate ? true : false,
          lastDonate: lastDonate
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