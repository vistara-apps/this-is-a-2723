import React from 'react'
import { TripBudgetProvider } from './context/TripBudgetContext'
import { ToastProvider } from './context/ToastContext'
import Dashboard from './components/Dashboard'
import ToastContainer from './components/ui/ToastContainer'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary 
      fallbackMessage="We're sorry, but something went wrong with the application. Please try refreshing the page."
      showDetails={process.env.NODE_ENV === 'development'}
    >
      <ToastProvider>
        <TripBudgetProvider>
          <div className="min-h-screen bg-bg">
            <ErrorBoundary fallbackMessage="There was an error loading the dashboard.">
              <Dashboard />
            </ErrorBoundary>
            <ToastContainer />
          </div>
        </TripBudgetProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
