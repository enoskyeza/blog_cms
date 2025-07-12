'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface PostCardProps {
  post: {
    id: string
    title: string
    excerpt?: string
    slug: string
    publishedAt: string
    featuredImage?: string
    tags?: string
    author: {
      name: string
      image?: string
    }
    _count: {
      likes: number
      comments: number
    }
  }
  onLike?: (postId: string) => void
  isLiked?: boolean
}

export function PostCard({ post, onLike, isLiked }: PostCardProps) {
  const [liked, setLiked] = useState(isLiked || false)
  const [likeCount, setLikeCount] = useState(post._count.likes)

  const handleLike = async () => {
    if (onLike) {
      onLike(post.id)
      setLiked(!liked)
      setLikeCount(prev => liked ? prev - 1 : prev + 1)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: `/blog/${post.slug}`
      })
    }
  }

  const tags = post.tags ? post.tags.split(',').map(tag => tag.trim()) : []

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardHeader className="p-0">
        {post.featuredImage && (
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.image} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{post.author.name}</span>
            <span className="mx-1">•</span>
            <span>{formatDistanceToNow(new Date(post.publishedAt))} ago</span>
          </div>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`gap-1 ${liked ? 'text-red-500' : ''}`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>{post._count.comments}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}