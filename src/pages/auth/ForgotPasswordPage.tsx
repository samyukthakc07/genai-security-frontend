import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // API call would go here
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <Mail className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
        <p className="text-sm text-gray-500">
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <Link to="/login" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Forgot password?</h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <Button type="submit" className="w-full" size="lg">
        Send reset link
      </Button>

      <p className="text-center text-sm text-gray-500">
        <Link to="/login" className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
      </p>
    </form>
  )
}
