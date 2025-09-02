import React from 'react'
import { Home, Plus, BarChart3, Settings, Plane, Share2, CreditCard } from 'lucide-react'

function Sidebar({ activeView, onViewChange }) {
  const menuItems = [
    { id: 'trips', label: 'My Trips', icon: Home, description: 'View all your trips' },
    { id: 'create-trip', label: 'Create Trip', icon: Plus, description: 'Create a new trip budget' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'View spending analytics' },
    { id: 'share', label: 'Share Trip', icon: Share2, description: 'Share trips with others' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Manage your account settings' }
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-text-primary">TripBudget</h1>
            <p className="text-xs text-text-secondary">Buddy</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4" aria-label="Main Navigation">
        <ul className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = activeView === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium
                    transition-all duration-150 outline-none focus:ring-2 focus:ring-primary
                    ${isActive 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.description}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={16} className="text-primary" />
            <span className="font-medium text-sm">Free Plan</span>
          </div>
          <p className="text-xs text-text-secondary mb-3">Upgrade for unlimited trips and premium features</p>
          <button 
            className="w-full bg-primary bg-opacity-10 text-primary text-sm font-medium py-2 rounded-md hover:bg-opacity-20 transition-colors"
            onClick={() => alert('Upgrade feature coming soon!')}
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
