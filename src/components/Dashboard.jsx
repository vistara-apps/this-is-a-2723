import React, { useState } from 'react'
import { Plus, Menu, X } from 'lucide-react'
import { useTripBudget } from '../context/TripBudgetContext'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import TripList from './TripList'
import TripCreation from './TripCreation'
import TripDetail from './TripDetail'
import Settings from './Settings'
import Card from './ui/Card'
import Button from './ui/Button'

function Dashboard() {
  const { trips, currentTrip } = useTripBudget()
  const { user } = useAuth()
  const [activeView, setActiveView] = useState('trips')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderMainContent = () => {
    switch (activeView) {
      case 'create-trip':
        return <TripCreation onComplete={() => setActiveView('trips')} />
      case 'trip-detail':
        return <TripDetail trip={currentTrip} onBack={() => setActiveView('trips')} />
      case 'settings':
        return <Settings />
      case 'analytics':
        // This would be a global analytics view, not trip-specific
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-text-primary">Analytics</h1>
            <Card className="p-6">
              <p className="text-text-secondary">Global analytics dashboard coming soon!</p>
            </Card>
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-text-primary">Welcome back, {user?.name || 'Traveler'}!</h1>
                <p className="text-sm text-text-secondary mt-1">Plan and track your travel expenses</p>
              </div>
              <Button
                variant="primary"
                onClick={() => setActiveView('create-trip')}
                className="flex items-center gap-2"
              >
                <Plus size={20} />
                Create Trip
              </Button>
            </div>

            {trips.length === 0 ? (
              <Card className="text-center py-12">
                <div className="max-w-sm mx-auto">
                  <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
                  <p className="text-text-secondary mb-6">Create your first trip to start budgeting and tracking expenses</p>
                  <Button
                    variant="primary"
                    onClick={() => setActiveView('create-trip')}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Plus size={20} />
                    Create Your First Trip
                  </Button>
                </div>
              </Card>
            ) : (
              <TripList onTripSelect={(trip) => {
                setActiveView('trip-detail')
              }} />
            )}
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-bg">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="secondary"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-surface border-r
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar 
          activeView={activeView} 
          onViewChange={(view) => {
            setActiveView(view)
            setSidebarOpen(false) // Close sidebar on mobile when view changes
          }} 
        />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-5 pt-16 lg:pt-5">
          {renderMainContent()}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
