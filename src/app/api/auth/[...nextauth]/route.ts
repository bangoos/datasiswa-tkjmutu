import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "NIS",
      credentials: {
        nis: { label: "NIS", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.nis || !credentials?.password) {
          return null
        }

        const student = await db.student.findUnique({
          where: { nis: credentials.nis }
        })

        if (!student) {
          return null
        }

        // Default password is NIS, otherwise use stored password
        const isPasswordValid = student.password === credentials.password

        if (!isPasswordValid) {
          return null
        }

        return {
          id: student.id.toString(),
          nis: student.nis,
          nama: student.nama,
          role: student.role
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.nis = user.nis
        token.nama = user.nama
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.nis = token.nis as string
        session.user.nama = token.nama as string
        session.user.role = token.role as string
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }
