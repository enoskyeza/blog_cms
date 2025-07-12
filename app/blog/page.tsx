'use client'

import { useState, useEffect } from 'react'
import { PostCard } from '@/components/blog/post-card'
import { SearchBar } from '@/components/blog/search-bar'
import { Pagination } from '@/components/blog/pagination'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { posts as mockPosts } from '@/lib/mockData'

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, pages: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    fetchPosts()
  }, [pagination.page, searchQuery, selectedTag])

  const fetchPosts = () => {
    setLoading(true)
    let filtered = [...mockPosts]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      )
    }

    if (selectedTag) {
      filtered = filtered.filter(p => p.tags?.toLowerCase().includes(selectedTag.toLowerCase()))
    }

    const total = filtered.length
    const pages = Math.ceil(total / pagination.limit)
    const start = (pagination.page - 1) * pagination.limit
    const pagePosts = filtered.slice(start, start + pagination.limit).map(p => ({ ...p, isLiked: false }))

    const allTags = filtered
      .filter(p => p.tags)
      .flatMap(p => p.tags!.split(',').map(tag => tag.trim()))
    setTags(Array.from(new Set(allTags)))

    setPosts(pagePosts)
    setPagination(prev => ({ ...prev, total, pages }))
    setLoading(false)
  }

  const handleLike = (postId: string) => {
    setPosts(posts.map((post: any) =>
      post.id === postId
        ? { ...post, _count: { ...post._count, likes: post._count.likes + (post.isLiked ? -1 : 1) }, isLiked: !post.isLiked }
        : post
    ))
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag === selectedTag ? '' : tag)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover insights, stories, and knowledge from our community of writers
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 6).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagFilter(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {selectedTag && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Filtering by tag: <Badge variant="default">{selectedTag}</Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleTagFilter('')}
                className="ml-2"
              >
                Clear filter
              </Button>
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            {posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {posts.map((post: any) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      isLiked={post.isLiked}
                    />
                  ))}
                </div>
                
                {pagination.pages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.pages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold mb-4">No posts found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new content'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}