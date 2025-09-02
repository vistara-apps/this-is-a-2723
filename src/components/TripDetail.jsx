import React, { useState } from 'react'
import { ArrowLeft, Plus, TrendingUp, DollarSign, Share2, Users } from 'lucide-react'
import { useTripBudget } from '../context/TripBudgetContext'
import Card from './ui/Card'
import Button from './ui/Button'
import ExpenseTracker from './ExpenseTracker'
import BudgetVisualization from './BudgetVisualization'
import ShareTrip from './ShareTrip'
import Tabs from './ui/Tabs'

function TripDetail({ trip, onBack }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [showShareModal, setShowShareModal] = useState(false)

  if (!trip) return null

  const totalBudget = trip.expenseCategories.reduce((sum, cat) => sum + cat.estimatedAmount, 0)
  const totalSpent = trip.expenseCategories.reduce((sum, cat) => sum + cat.actualAmount, 0)
  const remaining = totalBudget - totalSpent
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const tabConfig = [
    { id: 'overview', label: 'Overview' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'shared', label: 'Shared' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-text-primary">{trip.tripName}</h1>
          <p className="text-sm text-text-secondary">
            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowShareModal(true)}
          className="flex items-center gap-2"
        >
          <Share2 size={18} />
          Share
        </Button>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 gradient-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Total Budget</p>
              <p className="text-2xl font-bold text-text-primary">
                {trip.currency} {totalBudget.toFixed(2)}
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
                {trip.currency} {totalSpent.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
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
                {trip.currency} {remaining.toFixed(2)}
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
          <div className="w-full bg-gray-200 rounded-full h-3">
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
      />

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && (
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
                          {trip.currency} {category.actualAmount.toFixed(2)} / {category.estimatedAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
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
              {trip.expenses && trip.expenses.length > 0 ? (
                <div className="space-y-3">
                  {trip.expenses.slice(-5).reverse().map(expense => {
                    const category = trip.expenseCategories.find(c => c.categoryId === expense.categoryId)
                    return (
                      <div key={expense.expenseId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-text-primary">{expense.description}</p>
                          <p className="text-sm text-text-secondary">{category?.categoryName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-text-primary">
                            {trip.currency} {expense.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-text-secondary">{expense.date}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-text-secondary text-center py-8">
                  No expenses recorded yet
                </p>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'expenses' && (
          <ExpenseTracker trip={trip} />
        )}

        {activeTab === 'analytics' && (
          <BudgetVisualization trip={trip} />
        )}

        {activeTab === 'shared' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Shared Trip Budget</h3>
                <Button
                  variant="primary"
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2"
                >
                  <Users size={18} />
                  Manage Sharing
                </Button>
              </div>

              {trip.sharedWith && trip.sharedWith.length > 0 ? (
                <div>
                  <p className="text-text-secondary mb-4">
                    This trip is shared with {trip.sharedWith.length} {trip.sharedWith.length === 1 ? 'person' : 'people'}.
                  </p>
                  
                  <div className="space-y-3">
                    {trip.sharedWith.map((sharedUser) => (
                      <div key={sharedUser.userId} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-text-primary">{sharedUser.name}</p>
                        <p className="text-sm text-text-secondary">{sharedUser.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-secondary mb-4">
                    This trip is not shared with anyone yet.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Share2 size={18} />
                    Share Trip
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Shared Expenses</h3>
              
              {trip.expenses && trip.expenses.some(e => e.sharedWith && e.sharedWith.length > 0) ? (
                <div className="space-y-3">
                  {trip.expenses
                    .filter(e => e.sharedWith && e.sharedWith.length > 0)
                    .map(expense => {
                      const category = trip.expenseCategories.find(c => c.categoryId === expense.categoryId)
                      return (
                        <div key={expense.expenseId} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <p className="font-medium text-text-primary">{expense.description}</p>
                              <p className="text-sm text-text-secondary">
                                {category?.categoryName} • {expense.date}
                              </p>
                            </div>
                            <p className="font-semibold text-text-primary">
                              {trip.currency} {expense.amount.toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-sm text-text-secondary mb-2">Split with:</p>
                            <div className="flex flex-wrap gap-2">
                              {expense.sharedWith.map(share => (
                                <div key={share.userId} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  {share.name} ({trip.currency} {share.amount.toFixed(2)})
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <p className="text-text-secondary text-center py-8">
                  No shared expenses yet. When you split expenses with others, they will appear here.
                </p>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* Share Trip Modal */}
      {showShareModal && (
        <ShareTrip
          trip={trip}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  )
}

export default TripDetail
