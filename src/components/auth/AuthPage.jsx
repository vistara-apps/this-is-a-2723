import React, { useState } from 'react'
import { Plane } from 'lucide-react'
import Login from './Login'
import Register from './Register'
import ResetPassword from './ResetPassword'

function AuthPage() {
  const [authView, setAuthView] = useState('login')

  const handleToggleForm = (view) => {
    setAuthView(view)
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Plane className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
          TripBudget Buddy
        </h1>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Budget your dream vacation, track expenses effortlessly.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {authView === 'login' && <Login onToggleForm={handleToggleForm} />}
        {authView === 'register' && <Register onToggleForm={handleToggleForm} />}
        {authView === 'reset' && <ResetPassword onToggleForm={handleToggleForm} />}
        {authView === 'success' && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-text-primary mb-4">Registration Successful!</h2>
            <p className="text-text-secondary mb-6">
              Please check your email to confirm your account.
            </p>
            <button
              className="text-primary hover:underline"
              onClick={() => handleToggleForm('login')}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthPage

