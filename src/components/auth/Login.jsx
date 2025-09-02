import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'

function Login({ onToggleForm }) {
  const { signIn, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!email || !password) {
      setFormError('Please fill in all fields')
      return
    }

    try {
      await signIn(email, password)
      // Successful login will update the auth context and redirect
    } catch (error) {
      setFormError(error.message || 'Failed to sign in')
    }
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-text-primary">Welcome Back</h2>
        <p className="text-text-secondary mt-1">Sign in to continue to TripBudget Buddy</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {(formError || error) && (
          <div className="text-red-600 text-sm">{formError || error}</div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm text-primary hover:underline"
            onClick={() => onToggleForm('reset')}
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="text-center mt-4">
          <p className="text-text-secondary text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => onToggleForm('register')}
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </Card>
  )
}

export default Login

