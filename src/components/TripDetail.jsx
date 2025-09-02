import React, { useState } from 'react'
import { ArrowLeft, TrendingUp, DollarSign, Calendar, Share2 } from 'lucide-react'
import { useTripBudget } from '../context/TripBudgetContext'
import { useToast } from '../context/ToastContext'
import Card from './ui/Card'
import Button from './ui/Button'
import ExpenseTracker from './ExpenseTracker'
import BudgetVisualization from './BudgetVisualization'
import Tabs, { TabPanel } from './ui/Tabs'
import Skeleton from './ui/Skeleton'

function TripDetail({ trip, onBack }) {
  const { success } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)

  if (!trip) return null

  const totalBudget = trip.expenseCategories.reduce((sum, cat) => sum + cat.estimatedAmount, 0)
  const totalSpent = trip.expenseCategories.reduce((sum, cat) => sum + cat.actualAmount, 0)
  const remaining = totalBudget - totalSpent
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const tabConfig = [
    { id: 'overview', label: 'Overview' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'share', label: 'Share Trip' }
  ]

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: trip.currency || 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Format date range
  const formatDateRange = () => {
    const startDate = new Date(trip.startDate)
    const endDate = new Date(trip.endDate)
    
    // Calculate trip duration in days
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
    
    return {
      formatted: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      duration: duration
    }
  }

  // Handle share trip (placeholder for future implementation)
  const handleShareTrip = () => {
    success('Trip sharing feature coming soon!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={onBack}
          className="p-2"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-text-primary">{trip.tripName}</h1>
          <div className="flex items-center text-sm text-text-secondary gap-2">
            <Calendar size={14} className="text-gray-400" />
            <p>
              {formatDateRange().formatted} 
              <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                {formatDateRange().duration} {formatDateRange().duration === 1 ? 'day' : 'days'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6" variant="gradient">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Total Budget</p>
              <p className="text-2xl font-bold text-text-primary">
                {formatCurrency(totalBudget)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-text-primary">
                {formatCurrency(totalSpent)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6" variant={remaining >= 0 ? 'success' : 'error'}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              remaining >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <DollarSign className={`w-5 h-5 ${
                remaining >= 0 ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Remaining</p>
              <p className={`text-2xl font-bold ${
                remaining >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(remaining)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-text-primary">Budget Progress</h3>
            <span className="text-sm text-text-secondary">{spentPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3" role="progressbar" aria-valuenow={spentPercentage} aria-valuemin="0" aria-valuemax="100">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                spentPercentage > 100 
                  ? 'bg-red-500' 
                  : spentPercentage > 80 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={tabConfig}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        id="trip-tabs"
        ariaLabel="Trip Details"
      />

      {/* Tab Content */}
      <div className="animate-fade-in">
        <TabPanel id="trip-tabs" activeTab={activeTab} tabId="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Budget Breakdown</h3>
              <div className="space-y-3">
                {trip.expenseCategories.map(category => {
                  const categoryPercentage = category.estimatedAmount > 0 
                    ? (category.actualAmount / category.estimatedAmount) * 100 
                    : 0
                  
                  return (
                    <div key={category.categoryId} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-primary">{category.categoryName}</span>
                        <span className="text-text-secondary">
                          {formatCurrency(category.actualAmount)} / {formatCurrency(category.estimatedAmount)}
                        </span>
                      </div>
                      <div 
                        className="w-full bg-gray-200 rounded-full h-2"
                        role="progressbar" 
                        aria-valuenow={categoryPercentage} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                        aria-label={`${category.categoryName} budget usage: ${categoryPercentage.toFixed(1)}%`}
                      >
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            categoryPercentage > 100 
                              ? 'bg-red-500' 
                              : categoryPercentage > 80 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(categoryPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Recent Expenses</h3>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg">
                      <Skeleton.Text lines={2} />
                    </div>
                  ))}
                </div>
              ) : trip.expenses && trip.expenses.length > 0 ? (
                <div className="space-y-3">
                  {trip.expenses.slice(-5).reverse().map(expense => {
                    const category = trip.expenseCategories.find(c => c.categoryId === expense.categoryId)
                    return (
                      <div 
                        key={expense.expenseId} 
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        tabIndex={0}
                      >
                        <div>
                          <p className="font-medium text-text-primary">{expense.description}</p>
                          <p className="text-sm text-text-secondary">{category?.categoryName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-text-primary">
                            {formatCurrency(expense.amount)}
                          </p>
                          <p className="text-xs text-text-secondary">{new Date(expense.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-secondary">
                    No expenses recorded yet
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setActiveTab('expenses')}
                  >
                    Add Your First Expense
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </TabPanel>

        <TabPanel id="trip-tabs" activeTab={activeTab} tabId="expenses">
          <ExpenseTracker trip={trip} />
        </TabPanel>

        <TabPanel id="trip-tabs" activeTab={activeTab} tabId="analytics">
          <BudgetVisualization trip={trip} />
        </TabPanel>

        <TabPanel id="trip-tabs" activeTab={activeTab} tabId="share">
          <Card className="p-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share This Trip</h3>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                Invite friends or family to view and contribute to this trip budget. They'll be able to add expenses and track spending together.
              </p>
              <Button
                variant="primary"
                onClick={handleShareTrip}
                leftIcon={<Share2 size={16} />}
              >
                Share Trip
              </Button>
            </div>
          </Card>
        </TabPanel>
      </div>
    </div>
  )
}

export default TripDetail
