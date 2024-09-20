import Google from "next-auth/providers/google";

const CLIENT_ID = process.env.NEXT_GOOGLE_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_GOOGLE_APP_CLIENT_SECRET;

export const authOptions = {
  providers: [
    Google({
      clientId: CLIENT_ID!,
      clientSecret: CLIENT_SECRET!,
    }),
  ],
}
