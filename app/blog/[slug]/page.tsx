'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Heart, Clock, User, Tag, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CommentSection } from '@/components/blog/comment-section'
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share'

export default function BlogPost() {
  const { data: session } = useSession()
  const params = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string)
    }
  }, [params.slug])

  const fetchPost = async (slug: string) => {
    try {
      // First, get the post by slug
      const response = await fetch(`/api/posts?slug=${slug}&limit=1`)
      if (response.ok) {
        const data = await response.json()
        if (data.posts.length > 0) {
          const postData = data.posts[0]
          
          // Then get full post details with comments
          const detailResponse = await fetch(`/api/posts/${postData.id}`)
          if (detailResponse.ok) {
            const fullPost = await detailResponse.json()
            setPost(fullPost)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!session) {
      window.location.href = '/auth/signin'
      return
    }

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
      })
      if (response.ok) {
        const data = await response.json()
        setLiked(data.liked)
        setPost({ ...post, _count: { ...post._count, likes: data.likeCount } })
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleCommentSubmit = async (content: string, parentId?: string) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          postId: post.id,
          parentId,
        }),
      })

      if (response.ok) {
        // Refresh post to get updated comments
        fetchPost(params.slug as string)
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4" />
            <div className="h-64 bg-gray-200 rounded mb-6" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <p className="text-muted-foreground">The post you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const tags = post.tags ? post.tags.split(',').map((tag: string) => tag.trim()) : []
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.image} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author.name}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDistanceToNow(new Date(post.publishedAt))} ago
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {post._count.likes} likes
                  </span>
                </div>
              </div>
            </div>

            {post.featuredImage && (
              <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          <div className="prose max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <div className="flex items-center justify-between py-6 border-t border-b">
            <div className="flex items-center gap-4">
              <Button
                variant={liked ? "default" : "outline"}
                onClick={handleLike}
                className="gap-2"
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                {liked ? 'Liked' : 'Like'} ({post._count.likes})
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Share:</span>
              <FacebookShareButton url={shareUrl} quote={post.title}>
                <Button variant="outline" size="sm">Facebook</Button>
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={post.title}>
                <Button variant="outline" size="sm">Twitter</Button>
              </TwitterShareButton>
              <LinkedinShareButton url={shareUrl} title={post.title}>
                <Button variant="outline" size="sm">LinkedIn</Button>
              </LinkedinShareButton>
            </div>
          </div>

          <CommentSection
            postId={post.id}
            comments={post.comments}
            onCommentSubmit={handleCommentSubmit}
          />
        </article>
      </div>
    </div>
  )
}