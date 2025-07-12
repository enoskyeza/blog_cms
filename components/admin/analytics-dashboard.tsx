'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, MessageCircle, Heart, FileText } from 'lucide-react'
import { posts as mockPosts } from '@/lib/mockData'

interface AnalyticsData {
  overview: {
    totalPosts: number
    totalComments: number
    totalLikes: number
    recentPosts: number
  }
  popularPosts: Array<{
    id: string
    title: string
    _count: {
      likes: number
      comments: number
    }
  }>
  commentStats: {
    PENDING?: number
    APPROVED?: number
    REJECTED?: number
  }
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = () => {
    const totalPosts = mockPosts.length
    const totalComments = mockPosts.reduce((acc, p) => acc + p.comments.length, 0)
    const totalLikes = mockPosts.reduce((acc, p) => acc + p._count.likes, 0)
    const popularPosts = mockPosts.slice(0, 5)

    setAnalytics({
      overview: {
        totalPosts,
        totalComments,
        totalLikes,
        recentPosts: totalPosts
      },
      popularPosts,
      commentStats: {}
    })
    setLoading(false)
  }

  if (loading) {
    return <div>Loading analytics...</div>
  }

  if (!analytics) {
    return <div>Failed to load analytics</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              +{analytics.overview.recentPosts} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalComments}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.commentStats.PENDING || 0} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalLikes}</div>
            <p className="text-xs text-muted-foreground">
              Across all posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.overview.totalPosts ? 
                Math.round((analytics.overview.totalLikes + analytics.overview.totalComments) / analytics.overview.totalPosts) 
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg. per post
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Popular Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.popularPosts.map((post, index) => (
                <div key={post.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{post.title}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{post._count.likes} likes</span>
                      <span>{post._count.comments} comments</span>
                    </div>
                  </div>
                  <Badge variant="outline">#{index + 1}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Approved</span>
                <Badge variant="default">
                  {analytics.commentStats.APPROVED || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Pending</span>
                <Badge variant="secondary">
                  {analytics.commentStats.PENDING || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Rejected</span>
                <Badge variant="destructive">
                  {analytics.commentStats.REJECTED || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}