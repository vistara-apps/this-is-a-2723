import React from 'react'
import { Home, Plus, BarChart3, Settings, Plane } from 'lucide-react'

function Sidebar({ activeView, onViewChange }) {
  const menuItems = [
    { id: 'trips', label: 'My Trips', icon: Home },
    { id: 'create-trip', label: 'Create Trip', icon: Plus },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-text-primary">TripBudget</h2>
            <p className="text-xs text-text-secondary">Buddy</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = activeView === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                    transition-colors duration-150
                    ${isActive 
                      ? 'bg-primary text-white' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="text-xs text-text-secondary">
          <p>Free Plan</p>
          <p>Upgrade for unlimited trips</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar