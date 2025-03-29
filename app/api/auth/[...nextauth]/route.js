import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username },
        });

        if (admin && admin.password === credentials.password) {
          return { id: admin.id, name: admin.username, role: "admin" };
        }
        return null;
      },
    }),
    CredentialsProvider({
      id: "doctor-login",
      name: "Doctor Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const doctor = await prisma.doctor.findUnique({
          where: { username: credentials.username },
        });

        if (doctor && doctor.password === credentials.password) {
          return {
            id: doctor.id,
            name: doctor.username,
            role: "doctor",
            firstname: doctor.firstname,
            lastname: doctor.lastname,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.id = user.id;
      }
      // //console.log("Callback token:", token);
      // //console.log("Callback user:", user);
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.firstname = token.firstname;
      session.user.lastname = token.lastname;
      session.user.id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
