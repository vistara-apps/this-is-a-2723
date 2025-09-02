import React, { useState } from 'react'
import { Plus, Users, Edit, Trash, Share2, Camera, AlertCircle } from 'lucide-react'
import { useTripBudget } from '../context/TripBudgetContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { validateExpenseForm } from '../utils/validation'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import ExpenseSplitting from './ExpenseSplitting'
import ReceiptScanner from './ReceiptScanner'

function ExpenseTracker({ trip }) {
  const { user } = useAuth()
  const { addExpense, updateExpense, deleteExpense } = useTripBudget()
  const { addToast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [showSplitModal, setShowSplitModal] = useState(false)
  const [showScannerModal, setShowScannerModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    payerId: user?.id || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate form
    const validation = validateExpenseForm(formData)
    if (!validation.isValid) {
      setFormErrors(validation.errors)
      return
    }
    
    setFormErrors({})
    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount)
    }

    try {
      if (editingExpense) {
        // Update existing expense
        updateExpense(trip.tripId, editingExpense.expenseId, expenseData)
        addToast('Expense updated successfully', 'success')
        setEditingExpense(null)
      } else {
        // Add new expense
        addExpense(trip.tripId, expenseData)
        addToast('Expense added successfully', 'success')
      }

      // Reset form
      setFormData({
        description: '',
        amount: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0],
        payerId: user?.id || ''
      })
      setShowForm(false)
    } catch (error) {
      addToast(error.message || 'Failed to save expense', 'error')
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user makes changes
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      categoryId: expense.categoryId,
      date: expense.date,
      payerId: expense.payerId || user?.id || ''
    })
    setShowForm(true)
  }

  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        deleteExpense(trip.tripId, expenseId)
        addToast('Expense deleted successfully', 'success')
      } catch (error) {
        addToast(error.message || 'Failed to delete expense', 'error')
      }
    }
  }

  const handleSplitExpense = (expense) => {
    setSelectedExpense(expense)
    setShowSplitModal(true)
  }

  const handleSplitComplete = (expenseId, splitData) => {
    try {
      // Update the expense with split information
      updateExpense(trip.tripId, expenseId, {
        sharedWith: Object.entries(splitData).map(([userId, amount]) => ({
          userId,
          amount
        }))
      })
      addToast('Expense split successfully', 'success')
    } catch (error) {
      addToast(error.message || 'Failed to split expense', 'error')
    }
  }

  const handleScanComplete = (scanResult) => {
    if (scanResult) {
      try {
        addExpense(trip.tripId, {
          description: scanResult.description,
          amount: scanResult.amount,
          categoryId: scanResult.categoryId,
          date: scanResult.date,
          payerId: user?.id || ''
        })
        addToast('Receipt scanned and expense added successfully', 'success')
      } catch (error) {
        addToast(error.message || 'Failed to add scanned expense', 'error')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary">Expense Tracker</h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowScannerModal(true)}
            className="flex items-center gap-2"
            title="Scan receipt"
          >
            <Camera size={18} />
            <span className="hidden sm:inline">Scan Receipt</span>
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setEditingExpense(null)
              setFormData({
                description: '',
                amount: '',
                categoryId: '',
                date: new Date().toISOString().split('T')[0],
                payerId: user?.id || ''
              })
              setFormErrors({})
              setShowForm(!showForm)
            }}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Expense</span>
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="p-6 animate-slide-up">
          <h3 className="font-semibold text-lg mb-4">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Description"
              placeholder="e.g., Dinner at local restaurant"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              error={formErrors.description}
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
                error={formErrors.amount}
                required
              />

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleChange('categoryId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    formErrors.categoryId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select a category</option>
                  {trip.expenseCategories.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.categoryId}</p>
                )}
              </div>
            </div>

            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              error={formErrors.date}
              required
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary">
                {editingExpense ? 'Update Expense' : 'Add Expense'}
              </Button>
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => {
                  setShowForm(false)
                  setEditingExpense(null)
                  setFormErrors({})
                }}
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
                const isShared = expense.sharedWith && expense.sharedWith.length > 0
                
                return (
                  <div key={expense.expenseId} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-text-primary">{expense.description}</p>
                            <div className="flex items-center gap-4 text-sm text-text-secondary">
                              <span>{category?.categoryName}</span>
                              <span>{new Date(expense.date).toLocaleDateString()}</span>
                              {isShared && (
                                <span className="flex items-center gap-1 text-blue-600">
                                  <Users size={14} />
                                  Shared
                                </span>
                              )}
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
                    
                    <div className="flex justify-end gap-2 mt-3">
                      <Button
                        variant="secondary"
                        className="p-1"
                        onClick={() => handleSplitExpense(expense)}
                        title="Split expense"
                      >
                        <Share2 size={16} />
                      </Button>
                      <Button
                        variant="secondary"
                        className="p-1"
                        onClick={() => handleEditExpense(expense)}
                        title="Edit expense"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        className="p-1"
                        onClick={() => handleDeleteExpense(expense.expenseId)}
                        title="Delete expense"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                    
                    {isShared && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-text-secondary mb-2">Split with:</p>
                        <div className="flex flex-wrap gap-2">
                          {expense.sharedWith.map(share => (
                            <div key={share.userId} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {share.name || share.userId} ({trip.currency} {share.amount.toFixed(2)})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <AlertCircle size={48} className="text-text-secondary opacity-50" />
            </div>
            <p className="text-text-secondary mb-4">No expenses recorded yet</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="secondary"
                onClick={() => setShowScannerModal(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <Camera size={18} />
                Scan Receipt
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus size={18} />
                Add Expense Manually
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Expense Splitting Modal */}
      {showSplitModal && selectedExpense && (
        <ExpenseSplitting
          expense={selectedExpense}
          trip={trip}
          onClose={() => setShowSplitModal(false)}
          onSplit={handleSplitComplete}
        />
      )}

      {/* Receipt Scanner Modal */}
      {showScannerModal && (
        <ReceiptScanner
          trip={trip}
          onClose={() => setShowScannerModal(false)}
          onScanComplete={handleScanComplete}
        />
      )}
    </div>
  )
}

export default ExpenseTracker
