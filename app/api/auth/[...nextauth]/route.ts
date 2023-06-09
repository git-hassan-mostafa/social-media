import NextAuth, { Account, NextAuthOptions, Profile, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import userSchema from "../../schemas/userSchema";
import connect from "../../schemas/DBConnection";
import { UserSession } from "@/hooks/types";


const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID || '',
      clientSecret: process.env.FACEBOOK_SECRET_ID || ''
    })
  ],
  callbacks: {
    async session({ session }: { session: UserSession }) {
      if (session.user) {
        const sessionUser = await userSchema.findOne({ email: session?.user?.email }).populate({
          path: 'likedPost',
          populate: {
            path: 'user',
            model: 'User'
          }
        }).populate({
          path: 'savedPost',
          populate: {
            path: 'user',
            model: 'User'
          }
        });
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        session.expires = expires.toISOString();
        if (sessionUser) {
          session.user.id = sessionUser?._id?.toString();
          session.user.likedPost = sessionUser.likedPost
          session.user.savedPost = sessionUser.savedPost
        }

      }


      return session;
    },
    async signIn({ user, account, profile, email, credentials }: {
      user: User | null,
      account: Account | null,
      profile?: Profile | undefined,
      email?: { verificationRequest?: boolean | undefined } | undefined,
      credentials?: Record<string, unknown> | undefined
    }) {
      try {
        await connect();

        // check if user already exists
        const userExists = await userSchema.findOne({ email: user?.email });
        // if not, create a new document and save user in MongoDB
        if (!userExists) {
          await userSchema.create({
            email: user?.email,
            name: user?.name,
            photo: user?.image,
          });
        }

        return true;
      } catch (error: any) {
        console.log("Error checking if user exists: ", error?.message);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }