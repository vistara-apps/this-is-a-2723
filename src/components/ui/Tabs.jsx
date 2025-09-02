import React from 'react'

function Tabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = 'default',
  ariaLabel = 'Navigation Tabs',
  id = 'tabs'
}) {
  // Variant styles
  const variants = {
    default: 'border-b border-gray-200',
    pills: 'flex p-1 bg-gray-100 rounded-lg',
    cards: 'flex gap-2'
  }
  
  // Tab button styles based on variant
  const getTabStyles = (isActive, variant) => {
    switch(variant) {
      case 'pills':
        return isActive 
          ? 'bg-white shadow rounded-md text-primary font-medium' 
          : 'text-text-secondary hover:text-text-primary'
      case 'cards':
        return isActive 
          ? 'bg-primary text-white rounded-t-lg border-b-0' 
          : 'bg-gray-50 text-text-secondary hover:bg-gray-100 hover:text-text-primary rounded-t-lg'
      default: // default underline style
        return isActive
          ? 'border-b-2 border-primary text-primary font-medium'
          : 'border-b-2 border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
    }
  }
  
  return (
    <div className={variants[variant]}>
      <nav 
        className={`
          ${variant === 'default' ? '-mb-px flex space-x-8' : 'flex'}
          ${variant === 'pills' ? 'space-x-1' : ''}
          ${variant === 'cards' ? 'gap-1' : ''}
        `}
        role="tablist"
        aria-label={ariaLabel}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={`${id}-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-2 px-4 font-medium text-sm transition-all duration-150 outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
              ${getTabStyles(activeTab === tab.id, variant)}
            `}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${id}-panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
          >
            {tab.icon && (
              <span className={`mr-2 ${activeTab === tab.id ? 'text-primary' : 'text-gray-400'}`}>
                {tab.icon}
              </span>
            )}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

// TabPanel component for better accessibility
export function TabPanel({ 
  id, 
  activeTab, 
  tabId, 
  children,
  className = ''
}) {
  const isActive = activeTab === tabId
  
  return (
    <div
      id={`${id}-panel-${tabId}`}
      role="tabpanel"
      aria-labelledby={`${id}-tab-${tabId}`}
      hidden={!isActive}
      className={`focus:outline-none ${className}`}
      tabIndex={0}
    >
      {isActive && children}
    </div>
  )
}

export default Tabs
