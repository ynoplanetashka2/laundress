import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

const CLIENT_ID = process.env.NEXT_GOOGLE_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_GOOGLE_APP_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('invalid google application settings');
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }