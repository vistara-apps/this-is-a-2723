import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'

function Register({ onToggleForm }) {
  const { signUp, loading, error } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters')
      return
    }

    try {
      await signUp(email, password, name)
      // Show success message or redirect
      onToggleForm('success')
    } catch (error) {
      setFormError(error.message || 'Failed to sign up')
    }
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-text-primary">Create Account</h2>
        <p className="text-text-secondary mt-1">Sign up to start budgeting your trips</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />

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

        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {(formError || error) && (
          <div className="text-red-600 text-sm">{formError || error}</div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center mt-4">
          <p className="text-text-secondary text-sm">
            Already have an account?{' '}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => onToggleForm('login')}
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </Card>
  )
}

export default Register

