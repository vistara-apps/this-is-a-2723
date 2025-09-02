import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTripBudget } from '../context/TripBudgetContext'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'

function ExpenseTracker({ trip }) {
  const { addExpense } = useTripBudget()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.description || !formData.amount || !formData.categoryId) return

    addExpense(trip.tripId, {
      ...formData,
      amount: parseFloat(formData.amount)
    })

    // Reset form
    setFormData({
      description: '',
      amount: '',
      categoryId: '',
      date: new Date().toISOString().split('T')[0]
    })
    setShowForm(false)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary">Expense Tracker</h2>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Add Expense
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 animate-slide-up">
          <h3 className="font-semibold text-lg mb-4">Add New Expense</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Description"
              placeholder="e.g., Dinner at local restaurant"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleChange('categoryId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a category</option>
                  {trip.expenseCategories.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary">
                Add Expense
              </Button>
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Expenses List */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">All Expenses</h3>
        {trip.expenses && trip.expenses.length > 0 ? (
          <div className="space-y-3">
            {trip.expenses
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(expense => {
                const category = trip.expenseCategories.find(c => c.categoryId === expense.categoryId)
                return (
                  <div key={expense.expenseId} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-text-primary">{expense.description}</p>
                          <div className="flex items-center gap-4 text-sm text-text-secondary">
                            <span>{category?.categoryName}</span>
                            <span>{new Date(expense.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-text-primary">
                        {trip.currency} {expense.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )
              })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-4">No expenses recorded yet</p>
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus size={18} />
              Add Your First Expense
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default ExpenseTracker