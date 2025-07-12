'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'
import { MessageCircle, Reply } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    image?: string
  }
  replies?: Comment[]
}

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  onCommentSubmit: (content: string, parentId?: string) => void
}

export function CommentSection({ postId, comments, onCommentSubmit }: CommentSectionProps) {
  const { data: session } = useSession()
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onCommentSubmit(newComment)
      setNewComment('')
    }
  }

  const handleReplySubmit = (e: React.FormEvent, parentId: string) => {
    e.preventDefault()
    if (replyContent.trim()) {
      onCommentSubmit(replyContent, parentId)
      setReplyContent('')
      setReplyTo(null)
    }
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <Card className={`${isReply ? 'ml-8 mt-2' : 'mb-4'}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.image} />
            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm">{comment.author.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt))} ago
              </span>
            </div>
            <p className="text-sm mb-2">{comment.content}</p>
            {!isReply && session && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyTo(comment.id)}
                className="text-xs"
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </div>
        </div>

        {replyTo === comment.id && (
          <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="mt-4 ml-11">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="mb-2"
              rows={3}
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm">Reply</Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setReplyTo(null)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {comment.replies?.map((reply) => (
          <CommentItem key={reply.id} comment={reply} isReply />
        ))}
      </CardContent>
    </Card>
  )

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="h-6 w-6" />
        Comments ({comments.length})
      </h3>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-4"
            rows={4}
          />
          <Button type="submit" disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </form>
      ) : (
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Please sign in to leave a comment</p>
            <Button asChild>
              <a href="/auth/signin">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      )}

      <div>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        {comments.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}