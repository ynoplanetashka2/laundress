import NextAuth from "next-auth"
import Google from "next-auth/providers/google";

const CLIENT_ID = process.env.NEXT_GOOGLE_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_GOOGLE_APP_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('invalid google application settings');
}

export const authOptions = {
  providers: [
    Google({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    }),
  ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }