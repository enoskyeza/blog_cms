import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [
      totalPosts,
      totalComments,
      totalLikes,
      recentPosts,
      popularPosts,
      commentStats
    ] = await Promise.all([
      prisma.post.count(),
      prisma.comment.count(),
      prisma.like.count(),
      prisma.post.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      }),
      prisma.post.findMany({
        take: 5,
        orderBy: {
          likes: {
            _count: 'desc'
          }
        },
        include: {
          _count: {
            select: { likes: true, comments: true }
          }
        }
      }),
      prisma.comment.groupBy({
        by: ['status'],
        _count: true
      })
    ])

    return NextResponse.json({
      overview: {
        totalPosts,
        totalComments,
        totalLikes,
        recentPosts
      },
      popularPosts,
      commentStats: commentStats.reduce((acc, stat) => {
        acc[stat.status] = stat._count
        return acc
      }, {} as any)
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}