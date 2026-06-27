'use client'

import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/wallet/balance?currency=USD`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()
        if (data.success) {
          setBalance(data.data.balance)
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [])

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl shadow-xl p-8">
        <p className="text-primary-100 mb-2">Total Balance</p>
        <h1 className="text-5xl font-bold mb-4">${balance.toLocaleString()}</h1>
        <p className="text-primary-100">USD</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        <QuickActionCard icon="💳" title="Deposit" color="bg-blue-100" />
        <QuickActionCard icon="💸" title="Withdraw" color="bg-green-100" />
        <QuickActionCard icon="🔄" title="Transfer" color="bg-purple-100" />
        <QuickActionCard icon="📄" title="Statement" color="bg-orange-100" />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total Deposits" value="$50,000" trend="+12%" />
        <StatCard title="Total Withdrawals" value="$15,000" trend="-5%" />
        <StatCard title="Total Transfers" value="$25,000" trend="+8%" />
      </div>
    </div>
  )
}

function QuickActionCard({
  icon,
  title,
  color,
}: {
  icon: string
  title: string
  color: string
}) {
  return (
    <button className={`${color} rounded-xl p-6 hover:shadow-lg transition text-center`}>
      <div className="text-4xl mb-2">{icon}</div>
      <p className="font-semibold text-gray-900">{title}</p>
    </button>
  )
}

function StatCard({
  title,
  value,
  trend,
}: {
  title: string
  value: string
  trend: string
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className={`text-sm ${trend.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
        {trend} from last month
      </p>
    </div>
  )
}
