'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { PostCard } from '@/components/blog/post-card'
import { SearchBar } from '@/components/blog/search-bar'
import { Pagination } from '@/components/blog/pagination'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function BlogPage() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, pages: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    fetchPosts()
  }, [pagination.page, searchQuery, selectedTag])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: searchQuery,
        tag: selectedTag,
      })

      const response = await fetch(`/api/posts?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
        setPagination(data.pagination)
        
        // Extract unique tags
        const allTags = data.posts
          .filter((post: any) => post.tags)
          .flatMap((post: any) => post.tags.split(',').map((tag: string) => tag.trim()))
        setTags([...new Set(allTags)])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    if (!session) {
      window.location.href = '/auth/signin'
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      })
      if (response.ok) {
        // Update the post in the list
        setPosts(posts.map((post: any) => 
          post.id === postId 
            ? { ...post, _count: { ...post._count, likes: post._count.likes + (post.isLiked ? -1 : 1) }, isLiked: !post.isLiked }
            : post
        ))
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
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