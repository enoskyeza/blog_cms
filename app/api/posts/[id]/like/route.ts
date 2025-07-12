import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: params.id
        }
      }
    })

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id }
      })
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: session.user.id,
          postId: params.id
        }
      })
    }

    const likeCount = await prisma.like.count({
      where: { postId: params.id }
    })

    return NextResponse.json({ 
      liked: !existingLike,
      likeCount 
    })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}