import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'

function ResetPassword({ onToggleForm }) {
  const { resetPassword, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setSuccess(false)

    if (!email) {
      setFormError('Please enter your email')
      return
    }

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (error) {
      setFormError(error.message || 'Failed to send reset password email')
    }
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-text-primary">Reset Password</h2>
        <p className="text-text-secondary mt-1">
          Enter your email and we'll send you a link to reset your password
        </p>
      </div>

      {success ? (
        <div className="text-center">
          <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
            Password reset link sent! Check your email.
          </div>
          <Button
            variant="secondary"
            onClick={() => onToggleForm('login')}
            className="mt-4"
          >
            Back to Login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
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
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <div className="text-center mt-4">
            <button
              type="button"
              className="text-primary hover:underline text-sm"
              onClick={() => onToggleForm('login')}
            >
              Back to Login
            </button>
          </div>
        </form>
      )}
    </Card>
  )
}

export default ResetPassword

