'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <header className="fixed top-0 w-full bg-white dark:bg-gray-800 shadow-sm z-50">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">GTB</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Global Trust Bank</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-bold mb-6">
                  Banking Made Simple & Secure
                </h1>
                <p className="text-xl mb-8 text-primary-100">
                  Global Trust Bank brings enterprise-grade security and modern UX to international payments.
                </p>
                <div className="flex space-x-4">
                  <Link
                    href="/auth/register"
                    className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="#features"
                    className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">Total Balance</span>
                      <span className="text-2xl font-bold text-primary-600">$50,000</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-success-50 dark:bg-success-900 rounded-lg">
                        <p className="text-sm text-success-600 dark:text-success-300">Deposits</p>
                        <p className="text-xl font-bold text-success-900 dark:text-success-100">$25K</p>
                      </div>
                      <div className="p-4 bg-accent-50 dark:bg-accent-900 rounded-lg">
                        <p className="text-sm text-accent-600 dark:text-accent-300">Transfers</p>
                        <p className="text-xl font-bold text-accent-900 dark:text-accent-100">$10K</p>
                      </div>
                      <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-300">Withdrawals</p>
                        <p className="text-xl font-bold text-red-900 dark:text-red-100">$5K</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
              Powerful Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: '🔐 Enterprise Security',
                  description: 'Bank-level encryption, 2FA, and compliance with international standards',
                },
                {
                  title: '💱 Multi-Currency',
                  description: 'Support for USD, EUR, GBP and easy addition of new currencies',
                },
                {
                  title: '⚡ Real-time Transfers',
                  description: 'Send and receive money instantly with real-time notifications',
                },
                {
                  title: '📊 Analytics Dashboard',
                  description: 'Track spending, deposits, and transfers with detailed insights',
                },
                {
                  title: '🆔 KYC Verification',
                  description: 'Quick document verification with automated approval process',
                },
                {
                  title: '📱 Mobile Ready',
                  description: 'Fully responsive design works seamlessly on all devices',
                },
              ].map((feature, i) => (
                <div key={i} className="p-8 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Banking?</h2>
            <p className="text-xl mb-8 text-primary-100">
              Join thousands of users enjoying secure, fast, and reliable international banking.
            </p>
            <Link
              href="/auth/register"
              className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Create Account Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Global Trust Bank</h4>
              <p className="text-sm">Enterprise-grade banking for the modern world.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Features</Link></li>
                <li><Link href="#" className="hover:text-white">Security</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms</Link></li>
                <li><Link href="#" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Global Trust Bank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
