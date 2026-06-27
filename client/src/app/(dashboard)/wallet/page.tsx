'use client'

import { useEffect, useState } from 'react'

export default function WalletPage() {
  const [wallets, setWallets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('wallets')

  useEffect(() => {
    fetchWallets()
  }, [])

  const fetchWallets = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        setWallets(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch wallets:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Wallet Management</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab('wallets')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'wallets'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          My Wallets
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'actions'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Deposit / Withdraw
        </button>
      </div>

      {/* Wallets Tab */}
      {activeTab === 'wallets' && (
        <div className="grid grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg p-6 text-white"
            >
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-primary-100 text-sm mb-1">Balance</p>
                  <h3 className="text-3xl font-bold">${wallet.balance.toLocaleString()}</h3>
                </div>
                <div className="text-3xl">💳</div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-primary-100">Currency</p>
                <p className="text-xl font-semibold">{wallet.currency}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-primary-400 text-xs text-primary-100">
                Available: ${wallet.availableBalance.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions Tab */}
      {activeTab === 'actions' && (
        <div className="grid grid-cols-2 gap-6">
          <DepositForm />
          <WithdrawForm />
        </div>
      )}
    </div>
  )
}

function DepositForm() {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert('Deposit successful!')
        setAmount('')
      }
    } catch (error) {
      console.error('Deposit failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">💰 Deposit Funds</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-success-600 text-white rounded-lg font-semibold hover:bg-success-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Deposit'}
        </button>
      </form>
    </div>
  )
}

function WithdrawForm() {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert('Withdrawal successful!')
        setAmount('')
      }
    } catch (error) {
      console.error('Withdrawal failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">🏦 Withdraw Funds</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Withdraw'}
        </button>
      </form>
    </div>
  )
}
