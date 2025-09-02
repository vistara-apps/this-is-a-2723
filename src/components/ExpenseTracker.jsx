import React, { useState } from 'react'
import { Plus, Calendar, DollarSign, Tag, X, Receipt } from 'lucide-react'
import { useTripBudget } from '../context/TripBudgetContext'
import { useToast } from '../context/ToastContext'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import Skeleton from './ui/Skeleton'

function ExpenseTracker({ trip }) {
  const { addExpense } = useTripBudget()
  const { success, error: showError } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [errors, setErrors] = useState({})

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required'
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than zero'
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required'
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      showError('Please fix the errors before submitting')
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      addExpense(trip.tripId, {
        ...formData,
        amount: parseFloat(formData.amount)
      })
      
      // Show success message
      success('Expense added successfully!')
      
      // Reset form
      setFormData({
        description: '',
        amount: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0]
      })
      
      setShowForm(false)
    } catch (err) {
      showError('Failed to add expense. Please try again.')
      console.error('Error adding expense:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field when user makes changes
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: trip.currency || 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary">Expense Tracker</h2>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
          leftIcon={<Plus size={18} />}
          aria-expanded={showForm}
          aria-controls="expense-form"
        >
          Add Expense
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 animate-slide-up" id="expense-form">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Add New Expense</h3>
            <Button 
              variant="ghost" 
              className="p-1 h-auto" 
              onClick={() => setShowForm(false)}
              aria-label="Close form"
            >
              <X size={18} />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="expense-description"
              label="Description"
              placeholder="e.g., Dinner at local restaurant"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              error={errors.description}
              required
              leftIcon={<Receipt size={16} />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="expense-amount"
                label="Amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                error={errors.amount}
                required
                min="0.01"
                leftIcon={<DollarSign size={16} />}
              />

              <div>
                <label 
                  htmlFor="expense-category"
                  className="block text-sm font-medium text-text-primary mb-2 flex items-center"
                >
                  Category
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={16} className="text-gray-400" />
                  </div>
                  <select
                    id="expense-category"
                    value={formData.categoryId}
                    onChange={(e) => handleChange('categoryId', e.target.value)}
                    className={`
                      w-full pl-10 px-3 py-2 border rounded-md text-text-primary
                      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      ${errors.categoryId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
                    `}
                    required
                    aria-invalid={errors.categoryId ? 'true' : 'false'}
                    aria-describedby={errors.categoryId ? 'category-error' : undefined}
                  >
                    <option value="">Select a category</option>
                    {trip.expenseCategories.map(category => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.categoryId && (
                  <p className="text-sm text-red-600 mt-1" id="category-error">
                    {errors.categoryId}
                  </p>
                )}
              </div>
            </div>

            <Input
              id="expense-date"
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              error={errors.date}
              required
              leftIcon={<Calendar size={16} />}
              max={new Date().toISOString().split('T')[0]}
            />

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                variant="primary"
                isLoading={isSubmitting}
                loadingText="Adding..."
                disabled={isSubmitting}
              >
                Add Expense
              </Button>
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => setShowForm(false)}
                disabled={isSubmitting}
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
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex-1">
                  <Skeleton.Text lines={2} />
                </div>
                <div className="w-24">
                  <Skeleton height={24} />
                </div>
              </div>
            ))}
          </div>
        ) : trip.expenses && trip.expenses.length > 0 ? (
          <div className="space-y-3">
            {trip.expenses
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(expense => {
                const category = trip.expenseCategories.find(c => c.categoryId === expense.categoryId)
                return (
                  <div 
                    key={expense.expenseId} 
                    className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    tabIndex={0}
                    aria-label={`${expense.description}, ${formatCurrency(expense.amount)}, ${category?.categoryName}, ${new Date(expense.date).toLocaleDateString()}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-text-primary">{expense.description}</p>
                          <div className="flex items-center gap-4 text-sm text-text-secondary">
                            <span className="flex items-center gap-1">
                              <Tag size={14} className="text-gray-400" />
                              {category?.categoryName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} className="text-gray-400" />
                              {new Date(expense.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-text-primary">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>
                  </div>
                )
              })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Receipt size={24} className="text-gray-400" />
            </div>
            <p className="text-text-secondary mb-4">No expenses recorded yet</p>
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
              leftIcon={<Plus size={18} />}
              className="mx-auto"
            >
              Add Your First Expense
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default ExpenseTracker
