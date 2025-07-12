'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Save, Eye, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { postSchema } from '@/lib/validations'

interface PostEditorProps {
  post?: any
  onSave: (data: any) => void
  onCancel: () => void
}

export function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const [content, setContent] = useState(post?.content || '')
  const [isPreview, setIsPreview] = useState(false)

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      excerpt: post?.excerpt || '',
      status: post?.status || 'DRAFT',
      publishedAt: post?.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
      tags: post?.tags || '',
      featuredImage: post?.featuredImage || '',
    }
  })

  const handleSubmit = (data: any) => {
    onSave({ ...data, content })
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {post ? 'Edit Post' : 'Create New Post'}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>

      {!isPreview ? (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      {...form.register('title')}
                      placeholder="Enter post title..."
                    />
                      {form.formState.errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {String(form.formState.errors.title.message)}
                        </p>
                      )}
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      {...form.register('excerpt')}
                      placeholder="Brief description of the post..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your post content..."
                      rows={10}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publish Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={form.watch('status')}
                      onValueChange={(value) => form.setValue('status', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {form.watch('status') === 'SCHEDULED' && (
                    <div>
                      <Label htmlFor="publishedAt">Publish Date</Label>
                      <Input
                        id="publishedAt"
                        type="datetime-local"
                        {...form.register('publishedAt')}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      {...form.register('tags')}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>

                  <div>
                    <Label htmlFor="featuredImage">Featured Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="featuredImage"
                        {...form.register('featuredImage')}
                        placeholder="https://example.com/image.jpg"
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {post ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold mb-4">{form.watch('title')}</h1>
            {form.watch('excerpt') && (
              <p className="text-lg text-muted-foreground mb-6">
                {form.watch('excerpt')}
              </p>
            )}
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}