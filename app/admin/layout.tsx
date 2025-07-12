'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, FileText, MessageCircle, BarChart3, LogOut } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  // if (!session || session.user.role !== 'ADMIN') {
  //   return null
  // }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Comments', href: '/admin/comments', icon: MessageCircle },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r">
          <div className="p-6">
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          <nav className="px-4 space-y-2">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-6 left-4 right-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => router.push('/auth/signin')}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <header className="bg-white shadow-sm border-b p-6">
            <div className="flex items-center justify-between">
              {/*<h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>*/}
              <h1 className="text-2xl font-bold">Welcome, Admin</h1>
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="outline">View Site</Button>
                </Link>
              </div>
            </div>
          </header>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}