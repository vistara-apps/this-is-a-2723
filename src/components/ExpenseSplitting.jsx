import React, { useState, useEffect } from 'react'
import { X, DollarSign, Users, Calculator } from 'lucide-react'
import { sharedTripAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Card from './ui/Card'
import Button from './ui/Button'

function ExpenseSplitting({ expense, trip, onClose, onSplit }) {
  const { user } = useAuth()
  const [sharedUsers, setSharedUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [splitAmount, setSplitAmount] = useState(0)
  const [splitType, setSplitType] = useState('equal') // 'equal' or 'custom'
  const [customAmounts, setCustomAmounts] = useState({})

  useEffect(() => {
    // Load shared users when component mounts
    const fetchSharedUsers = async () => {
      try {
        setLoading(true)
        const users = await sharedTripAPI.getSharedUsers(trip.tripId)
        setSharedUsers(users)
        
        // Initialize custom amounts
        const amounts = {}
        users.forEach(u => {
          amounts[u.userId] = 0
        })
        // Add current user
        amounts[user.id] = 0
        setCustomAmounts(amounts)
      } catch (err) {
        setError('Failed to load shared users')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSharedUsers()
  }, [trip.tripId, user.id])

  useEffect(() => {
    // Calculate split amount when selected users change
    if (splitType === 'equal' && selectedUsers.length > 0) {
      const amount = expense.amount / (selectedUsers.length + 1) // +1 for current user
      setSplitAmount(amount)
    }
  }, [selectedUsers, expense.amount, splitType])

  const handleUserToggle = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleCustomAmountChange = (userId, amount) => {
    setCustomAmounts({
      ...customAmounts,
      [userId]: parseFloat(amount) || 0
    })
  }

  const handleSplitExpense = () => {
    try {
      // Prepare the split data
      let splitData = {}
      
      if (splitType === 'equal') {
        // Equal split
        selectedUsers.forEach(userId => {
          splitData[userId] = splitAmount
        })
        // Add current user's share
        splitData[user.id] = splitAmount
      } else {
        // Custom split
        splitData = customAmounts
      }
      
      // Call the parent component's onSplit function with the split data
      onSplit(expense.expenseId, splitData)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to split expense')
      console.error(err)
    }
  }

  // Calculate total of custom amounts
  const customTotal = Object.values(customAmounts).reduce((sum, amount) => sum + amount, 0)
  const isValidCustomSplit = Math.abs(customTotal - expense.amount) < 0.01 // Allow for small rounding errors

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Split Expense</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-text-primary">{expense.description}</h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-text-secondary">Total Amount</span>
              <span className="text-xl font-semibold text-text-primary">
                {trip.currency} {expense.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <button
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
                splitType === 'equal' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-text-primary'
              }`}
              onClick={() => setSplitType('equal')}
            >
              <Users size={18} />
              Equal Split
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
                splitType === 'custom' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-text-primary'
              }`}
              onClick={() => setSplitType('custom')}
            >
              <Calculator size={18} />
              Custom Split
            </button>
          </div>

          {splitType === 'equal' ? (
            <div className="space-y-4">
              <p className="text-text-secondary">
                Select who to split this expense with:
              </p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {/* Current user (always included) */}
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">{user.name || user.email} (You)</p>
                    <p className="text-sm text-text-secondary">
                      {trip.currency} {splitAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                </div>
                
                {/* Shared users */}
                {sharedUsers.map((sharedUser) => (
                  <div 
                    key={sharedUser.userId}
                    className="flex items-center p-3 bg-gray-50 rounded-md cursor-pointer"
                    onClick={() => handleUserToggle(sharedUser.userId)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{sharedUser.name}</p>
                      <p className="text-sm text-text-secondary">
                        {selectedUsers.includes(sharedUser.userId) 
                          ? `${trip.currency} ${splitAmount.toFixed(2)}`
                          : 'Not included'}
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedUsers.includes(sharedUser.userId)
                        ? 'bg-primary'
                        : 'border border-gray-300'
                    }`}>
                      {selectedUsers.includes(sharedUser.userId) && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-text-secondary">
                Enter custom amounts for each person:
              </p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {/* Current user */}
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">{user.name || user.email} (You)</p>
                  </div>
                  <div className="w-24 relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
                      {trip.currency}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={customAmounts[user.id] || ''}
                      onChange={(e) => handleCustomAmountChange(user.id, e.target.value)}
                      className="w-full pl-10 pr-2 py-1 border rounded-md text-right"
                    />
                  </div>
                </div>
                
                {/* Shared users */}
                {sharedUsers.map((sharedUser) => (
                  <div 
                    key={sharedUser.userId}
                    className="flex items-center p-3 bg-gray-50 rounded-md"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{sharedUser.name}</p>
                    </div>
                    <div className="w-24 relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
                        {trip.currency}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={customAmounts[sharedUser.userId] || ''}
                        onChange={(e) => handleCustomAmountChange(sharedUser.userId, e.target.value)}
                        className="w-full pl-10 pr-2 py-1 border rounded-md text-right"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-md">
                <span className="font-medium">Total</span>
                <span className={`font-semibold ${isValidCustomSplit ? 'text-green-600' : 'text-red-600'}`}>
                  {trip.currency} {customTotal.toFixed(2)} / {expense.amount.toFixed(2)}
                </span>
              </div>
              
              {!isValidCustomSplit && (
                <p className="text-red-600 text-sm">
                  The total must equal the expense amount ({trip.currency} {expense.amount.toFixed(2)})
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleSplitExpense}
            className="flex-1 flex items-center justify-center gap-2"
            disabled={
              (splitType === 'equal' && selectedUsers.length === 0) ||
              (splitType === 'custom' && !isValidCustomSplit)
            }
          >
            <DollarSign size={18} />
            Split Expense
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  )
}

// Check component for the UI
function Check({ size = 14, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  )
}

export default ExpenseSplitting

