import React from 'react'
import { AuthProvider } from './context/AuthContext'
import { TripBudgetProvider } from './context/TripBudgetContext'
import { ToastProvider } from './context/ToastContext'
import Dashboard from './components/Dashboard'
import AuthPage from './components/auth/AuthPage'
import { useAuth } from './context/AuthContext'

// Protected route component
function ProtectedApp() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-pulse text-text-primary">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <TripBudgetProvider>
      <div className="min-h-screen bg-bg">
        <Dashboard />
      </div>
    </TripBudgetProvider>
  )
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProtectedApp />
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
