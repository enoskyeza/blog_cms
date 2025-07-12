import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { postSchema } from "@/lib/validations"
import { generateSlug, generateUniqueSlug } from "@/lib/utils/slug"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const tag = searchParams.get('tag') || ''
    const status = searchParams.get('status') || 'PUBLISHED'

    const skip = (page - 1) * limit

    const where: any = {}

    if (status === 'PUBLISHED') {
      where.status = 'PUBLISHED'
      where.publishedAt = { lte: new Date() }
    } else if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (tag) {
      where.tags = { contains: tag, mode: 'insensitive' }
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, email: true, image: true }
          },
          _count: {
            select: { likes: true, comments: true }
          }
        }
      }),
      prisma.post.count({ where })
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = postSchema.parse(body)

    // Generate slug
    const baseSlug = generateSlug(data.title)
    const existingPosts = await prisma.post.findMany({
      where: { slug: { startsWith: baseSlug } },
      select: { slug: true }
    })
    const existingSlugs = existingPosts.map(p => p.slug)
    const slug = generateUniqueSlug(baseSlug, existingSlugs)

    const postData: any = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      slug,
      status: data.status,
      tags: data.tags,
      featuredImage: data.featuredImage,
      authorId: session.user.id,
    }

    if (data.status === 'PUBLISHED' && !data.publishedAt) {
      postData.publishedAt = new Date()
    } else if (data.publishedAt) {
      postData.publishedAt = new Date(data.publishedAt)
    }

    const post = await prisma.post.create({
      data: postData,
      include: {
        author: {
          select: { id: true, name: true, email: true, image: true }
        }
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}