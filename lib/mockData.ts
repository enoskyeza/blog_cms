export interface Comment {
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

export interface Post {
  id: string
  title: string
  excerpt: string
  slug: string
  content: string
  publishedAt: string
  featuredImage?: string
  tags?: string
  author: {
    id: string
    name: string
    image?: string
  }
  _count: {
    likes: number
    comments: number
  }
  comments: Comment[]
}

export const posts: Post[] = [
  {
    id: '1',
    title: 'First Post',
    excerpt: 'This is the first post',
    slug: 'first-post',
    content: '<p>Welcome to the first post.</p>',
    publishedAt: new Date().toISOString(),
    featuredImage: '',
    tags: 'demo,first',
    author: { id: '1', name: 'Admin' },
    _count: { likes: 0, comments: 2 },
    comments: [
      {
        id: 'c1',
        content: 'Great post!',
        createdAt: new Date().toISOString(),
        author: { id: '2', name: 'User' }
      },
      {
        id: 'c2',
        content: 'Thanks for sharing',
        createdAt: new Date().toISOString(),
        author: { id: '3', name: 'Alice' }
      }
    ]
  },
  {
    id: '2',
    title: 'Second Post',
    excerpt: 'Another interesting article',
    slug: 'second-post',
    content: '<p>This is the second post.</p>',
    publishedAt: new Date().toISOString(),
    featuredImage: '',
    tags: 'demo,second',
    author: { id: '1', name: 'Admin' },
    _count: { likes: 0, comments: 0 },
    comments: []
  }
]
