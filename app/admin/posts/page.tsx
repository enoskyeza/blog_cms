'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PostEditor } from '@/components/admin/post-editor'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { posts as mockPosts, Post } from '@/lib/mockData'
import { formatDistanceToNow } from 'date-fns'

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = () => {
    setPosts(mockPosts)
    setLoading(false)
  }

  const handleSave = (data: any) => {
    if (editingPost) {
      setPosts(posts.map((p: Post) => p.id === editingPost.id ? { ...editingPost, ...data } : p))
    } else {
      const newPost: Post = {
        id: Math.random().toString(),
        _count: { likes: 0, comments: 0 },
        comments: [],
        ...data,
        publishedAt: new Date().toISOString(),
        author: { id: '1', name: 'Admin' }
      }
      setPosts([newPost, ...posts])
    }
    setShowEditor(false)
    setEditingPost(null)
  }

  const handleDelete = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter((p: Post) => p.id !== postId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'default'
      case 'DRAFT': return 'secondary'
      case 'SCHEDULED': return 'outline'
      default: return 'secondary'
    }
  }

  if (showEditor) {
    return (
      <PostEditor
        post={editingPost}
        onSave={handleSave}
        onCancel={() => {
          setShowEditor(false)
          setEditingPost(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Posts</h2>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {loading ? (
        <div>Loading posts...</div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post: any) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{post.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>By {post.author.name}</span>
                      <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                      <Badge variant={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                      <span>{post._count.likes} likes</span>
                      <span>{post._count.comments} comments</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPost(post)
                        setShowEditor(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {post.excerpt && (
                <CardContent>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}