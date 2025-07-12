// import { NextRequest, NextResponse } from "next/server"
// import bcrypt from "bcryptjs"
// import { prisma } from "@/lib/prisma"
// import { userSchema } from "@/lib/validations"
//
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { name, email, password } = userSchema.parse(body)
//
//     const existingUser = await prisma.user.findUnique({
//       where: { email }
//     })
//
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 400 }
//       )
//     }
//
//     const hashedPassword = await bcrypt.hash(password, 12)
//
//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//       }
//     })
//
//     const { password: _, ...userWithoutPassword } = user
//
//     return NextResponse.json({ user: userWithoutPassword })
//   } catch (error) {
//     console.error('Registration error:', error)
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     )
//   }
// }