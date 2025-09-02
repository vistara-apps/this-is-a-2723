import React from 'react'
import { TripBudgetProvider } from './context/TripBudgetContext'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <TripBudgetProvider>
      <div className="min-h-screen bg-bg">
        <Dashboard />
      </div>
    </TripBudgetProvider>
  )
}

export default App