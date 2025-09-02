import React, { useState, useEffect } from 'react'
import { Plus, Menu, X, Plane, Compass, Home } from 'lucide-react'
import { useTripBudget } from '../context/TripBudgetContext'
import { useToast } from '../context/ToastContext'
import Sidebar from './Sidebar'
import TripList from './TripList'
import TripCreation from './TripCreation'
import TripDetail from './TripDetail'
import Card from './ui/Card'
import Button from './ui/Button'
import Skeleton from './ui/Skeleton'
import ErrorBoundary from './ErrorBoundary'

function Dashboard() {
  const { trips, currentTrip, user } = useTripBudget()
  const { error: showError } = useToast()
  const [activeView, setActiveView] = useState('trips')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Close sidebar when changing views on mobile
  useEffect(() => {
    if (sidebarOpen) {
      setSidebarOpen(false)
    }
  }, [activeView])
  
  // Handle errors
  const handleError = (err) => {
    console.error('Dashboard error:', err)
    showError('Something went wrong. Please try again.')
  }

  const renderMainContent = () => {
    if (isLoading) {
      return <DashboardSkeleton />
    }
    
    switch (activeView) {
      case 'create-trip':
        return (
          <ErrorBoundary fallbackMessage="There was an error creating a trip.">
            <TripCreation onComplete={() => setActiveView('trips')} />
          </ErrorBoundary>
        )
      case 'trip-detail':
        return (
          <ErrorBoundary fallbackMessage="There was an error loading trip details.">
            <TripDetail trip={currentTrip} onBack={() => setActiveView('trips')} />
          </ErrorBoundary>
        )
      default:
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary">Welcome back, {user.name}!</h1>
                <p className="text-sm text-text-secondary mt-1">Plan and track your travel expenses</p>
              </div>
              <Button
                variant="primary"
                onClick={() => setActiveView('create-trip')}
                leftIcon={<Plus size={20} />}
                className="w-full sm:w-auto"
              >
                Create Trip
              </Button>
            </div>

            {trips.length === 0 ? (
              <EmptyTripsState setActiveView={setActiveView} />
            ) : (
              <ErrorBoundary fallbackMessage="There was an error loading your trips.">
                <TripList 
                  onTripSelect={(trip) => {
                    setActiveView('trip-detail')
                  }} 
                />
              </ErrorBoundary>
            )}
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-bg">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="secondary"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={sidebarOpen}
          aria-controls="sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div 
        id="sidebar"
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-surface border-r
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-hidden={!sidebarOpen && window.innerWidth < 1024}
      >
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-4 sm:p-5 pt-16 lg:pt-5">
          {renderMainContent()}
        </div>
      </div>
      
      {/* Mobile bottom navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t z-30 py-2">
        <div className="flex justify-around items-center">
          <button 
            className={`flex flex-col items-center p-2 ${activeView === 'trips' ? 'text-primary' : 'text-text-secondary'}`}
            onClick={() => setActiveView('trips')}
            aria-label="View trips"
            aria-current={activeView === 'trips' ? 'page' : undefined}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button 
            className={`flex flex-col items-center p-2 ${activeView === 'create-trip' ? 'text-primary' : 'text-text-secondary'}`}
            onClick={() => setActiveView('create-trip')}
            aria-label="Create trip"
            aria-current={activeView === 'create-trip' ? 'page' : undefined}
          >
            <Plus size={20} />
            <span className="text-xs mt-1">New Trip</span>
          </button>
          <button 
            className="flex flex-col items-center p-2 text-text-secondary"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <Compass size={20} />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </div>
      
      {/* Add padding at the bottom for mobile to account for the bottom navigation */}
      <div className="h-16 lg:h-0 w-full" aria-hidden="true"></div>
    </div>
  )
}

// Empty state component
function EmptyTripsState({ setActiveView }) {
  return (
    <Card className="text-center py-12">
      <div className="max-w-sm mx-auto">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plane className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
        <p className="text-text-secondary mb-6">Create your first trip to start budgeting and tracking expenses</p>
        <Button
          variant="primary"
          onClick={() => setActiveView('create-trip')}
          leftIcon={<Plus size={20} />}
          className="mx-auto"
        >
          Create Your First Trip
        </Button>
      </div>
    </Card>
  )
}

// Loading skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton width={240} height={36} className="mb-2" />
          <Skeleton width={180} height={20} />
        </div>
        <Skeleton width={120} height={40} />
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map(i => (
          <Skeleton.Card key={i} />
        ))}
      </div>
    </div>
  )
}

export default Dashboard
