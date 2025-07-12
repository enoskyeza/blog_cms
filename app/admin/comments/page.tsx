'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check, X, Trash2 } from 'lucide-react'
import { posts as mockPosts } from '@/lib/mockData'
import { formatDistanceToNow } from 'date-fns'

export default function AdminComments() {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchComments()
  }, [filter])

  const fetchComments = () => {
    let all = mockPosts.flatMap(post => post.comments.map(c => ({ ...c, post })))
    if (filter !== 'all') {
      all = all.filter(c => (c as any).status ? (c as any).status === filter : true)
    }
    setComments(all)
    setLoading(false)
  }

  const updateCommentStatus = (commentId: string, status: string) => {
    setComments(comments.map((c: any) => c.id === commentId ? { ...c, status } : c))
  }

  const deleteComment = (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      setComments(comments.filter((c: any) => c.id !== commentId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'default'
      case 'PENDING': return 'secondary'
      case 'REJECTED': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Comments</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Comments</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div>Loading comments...</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment: any) => (
            <Card key={comment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.author.image} />
                      <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{comment.author.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {comment.author.email}
                        </span>
                        <Badge variant={getStatusColor(comment.status)}>
                          {comment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        On: {comment.post.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt))} ago
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {comment.status === 'PENDING' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCommentStatus(comment.id, 'APPROVED')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCommentStatus(comment.id, 'REJECTED')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteComment(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>{comment.content}</p>
              </CardContent>
            </Card>
          ))}
          {comments.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No comments found</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}