
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "../../../../../lib/db";
import User from "../../../../../models/user.model";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
        await connectDB()
        const existingUser = await User.findOne({ email: user.email });

       
      return true; // Allow login
    },
    async session({ session, token }) {
      // Attach the user ID to the session object so you can use it in your frontend
      if (session?.user) {
        // @ts-ignore
        session.user.id = token.sub; 
      }
      return session;
    },
  },
  session: {
    strategy: "jwt", 
  },
});


export { handler as GET, handler as POST };