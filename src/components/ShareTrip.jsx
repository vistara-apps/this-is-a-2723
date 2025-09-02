import React, { useState, useEffect } from 'react'
import { UserPlus, X, Check, AlertCircle } from 'lucide-react'
import { sharedTripAPI } from '../services/api'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'

function ShareTrip({ trip, onClose }) {
  const [email, setEmail] = useState('')
  const [sharedUsers, setSharedUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Load shared users when component mounts
    const fetchSharedUsers = async () => {
      try {
        setLoading(true)
        const users = await sharedTripAPI.getSharedUsers(trip.tripId)
        setSharedUsers(users)
      } catch (err) {
        setError('Failed to load shared users')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSharedUsers()
  }, [trip.tripId])

  const handleShareTrip = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError('Please enter an email address')
      return
    }

    try {
      setLoading(true)
      await sharedTripAPI.shareTrip(trip.tripId, email)
      setSuccess(`Trip shared with ${email}`)
      setEmail('')
      
      // Refresh the list of shared users
      const users = await sharedTripAPI.getSharedUsers(trip.tripId)
      setSharedUsers(users)
    } catch (err) {
      setError(err.message || 'Failed to share trip')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveUser = async (userId) => {
    try {
      setLoading(true)
      await sharedTripAPI.unshareTrip(trip.tripId, userId)
      
      // Update the list of shared users
      setSharedUsers(sharedUsers.filter(user => user.userId !== userId))
      setSuccess('User removed from shared trip')
    } catch (err) {
      setError(err.message || 'Failed to remove user')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Share Trip</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-text-secondary mb-6">
          Share "{trip.tripName}" with others to collaborate on budgeting and expense tracking.
        </p>

        <form onSubmit={handleShareTrip} className="mb-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <UserPlus size={18} />
              Share
            </Button>
          </div>
        </form>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center gap-2">
            <Check size={18} />
            {success}
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-medium text-text-primary mb-3">Shared With</h3>
          {loading && <p className="text-text-secondary">Loading...</p>}
          
          {!loading && sharedUsers.length === 0 && (
            <p className="text-text-secondary">This trip is not shared with anyone yet.</p>
          )}

          <ul className="space-y-2">
            {sharedUsers.map((user) => (
              <li 
                key={user.userId} 
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="font-medium text-text-primary">{user.name}</p>
                  <p className="text-sm text-text-secondary">{user.email}</p>
                </div>
                <button
                  onClick={() => handleRemoveUser(user.userId)}
                  className="text-red-500 hover:text-red-700"
                  title="Remove user"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  )
}

export default ShareTrip

