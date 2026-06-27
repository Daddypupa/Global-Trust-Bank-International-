'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token) {
      router.push('/auth/login')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary-600">GTB</h1>
        </div>
        <nav className="mt-6 space-y-2">
          <NavLink href="/dashboard" label="Dashboard" icon="📊" />
          <NavLink href="/dashboard/wallet" label="Wallet" icon="💰" />
          <NavLink href="/dashboard/transactions" label="Transactions" icon="💳" />
          <NavLink href="/dashboard/kyc" label="KYC" icon="🆔" />
          <NavLink href="/dashboard/settings" label="Settings" icon="⚙️" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user?.firstName} {user?.lastName}</span>
            <button
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                router.push('/auth/login')
              }}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a
      href={href}
      className="block px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition"
    >
      <span className="mr-3">{icon}</span>
      {label}
    </a>
  )
}
