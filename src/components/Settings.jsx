import React, { useState, useEffect } from 'react'
import { Save, User, CreditCard, Bell, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import Tabs from './ui/Tabs'

function Settings() {
  const { user, updateProfile, updatePassword, loading, error } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currencyPreference: 'USD'
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [subscriptionStatus, setSubscriptionStatus] = useState('free')
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        currencyPreference: user.currencyPreference || 'USD'
      })
    }
  }, [user])

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    try {
      await updateProfile({
        name: profileData.name,
        currencyPreference: profileData.currencyPreference
      })
      setFormSuccess('Profile updated successfully')
    } catch (err) {
      setFormError(err.message || 'Failed to update profile')
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setFormError('Password must be at least 6 characters')
      return
    }

    try {
      await updatePassword(passwordData.newPassword)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setFormSuccess('Password updated successfully')
    } catch (err) {
      setFormError(err.message || 'Failed to update password')
    }
  }

  const handleUpgradeSubscription = () => {
    // In a real app, this would open a payment flow
    alert('This would open a payment flow in a real application')
  }

  const tabConfig = [
    { id: 'profile', label: 'Profile' },
    { id: 'subscription', label: 'Subscription' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-text-primary">Settings</h1>
      
      <Tabs
        tabs={tabConfig}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="animate-fade-in">
        {activeTab === 'profile' && (
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Profile Settings</h2>
                <p className="text-text-secondary text-sm">Update your personal information</p>
              </div>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input
                label="Name"
                value={profileData.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                placeholder="Your name"
              />
              
              <Input
                label="Email"
                value={profileData.email}
                disabled
                placeholder="Your email"
                helperText="Email cannot be changed"
              />
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Preferred Currency
                </label>
                <select
                  value={profileData.currencyPreference}
                  onChange={(e) => handleProfileChange('currencyPreference', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
              
              {(formError || error) && activeTab === 'profile' && (
                <div className="text-red-600 text-sm">{formError || error}</div>
              )}
              
              {formSuccess && activeTab === 'profile' && (
                <div className="text-green-600 text-sm">{formSuccess}</div>
              )}
              
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        )}
        
        {activeTab === 'subscription' && (
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Subscription</h2>
                <p className="text-text-secondary text-sm">Manage your subscription plan</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-text-primary">Current Plan</h3>
                    <p className="text-text-secondary">
                      {subscriptionStatus === 'premium' ? 'Premium Plan' : 'Free Plan'}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    subscriptionStatus === 'premium' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subscriptionStatus === 'premium' ? 'Active' : 'Free Tier'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 border-2 border-gray-200">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">Free Plan</h3>
                    <p className="text-3xl font-bold mt-2">$0<span className="text-sm text-text-secondary">/month</span></p>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Up to 3 trips</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Basic expense tracking</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      <span>No shared trips</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      <span>No advanced analytics</span>
                    </li>
                  </ul>
                  
                  <Button
                    variant="secondary"
                    className="w-full"
                    disabled={subscriptionStatus === 'free'}
                  >
                    Current Plan
                  </Button>
                </Card>
                
                <Card className="p-4 border-2 border-primary">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">Premium Plan</h3>
                    <p className="text-3xl font-bold mt-2">$5<span className="text-sm text-text-secondary">/month</span></p>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Unlimited trips</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Advanced expense tracking</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Shared trips with friends</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Advanced analytics</span>
                    </li>
                  </ul>
                  
                  <Button
                    variant="primary"
                    className="w-full"
                    disabled={subscriptionStatus === 'premium'}
                    onClick={handleUpgradeSubscription}
                  >
                    {subscriptionStatus === 'premium' ? 'Current Plan' : 'Upgrade Now'}
                  </Button>
                </Card>
              </div>
            </div>
          </Card>
        )}
        
        {activeTab === 'security' && (
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Security</h2>
                <p className="text-text-secondary text-sm">Manage your password and security settings</p>
              </div>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                placeholder="••••••••"
                required
              />
              
              <Input
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                placeholder="••••••••"
                required
              />
              
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
                required
              />
              
              {(formError || error) && activeTab === 'security' && (
                <div className="text-red-600 text-sm">{formError || error}</div>
              )}
              
              {formSuccess && activeTab === 'security' && (
                <div className="text-green-600 text-sm">{formSuccess}</div>
              )}
              
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <Save size={18} />
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </Card>
        )}
        
        {activeTab === 'notifications' && (
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Notifications</h2>
                <p className="text-text-secondary text-sm">Manage your notification preferences</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-text-primary">Email Notifications</h3>
                  <p className="text-sm text-text-secondary">Receive trip updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-text-primary">Budget Alerts</h3>
                  <p className="text-sm text-text-secondary">Get notified when you're close to your budget limit</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-text-primary">Trip Reminders</h3>
                  <p className="text-sm text-text-secondary">Receive reminders before your trip starts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-text-primary">Marketing Emails</h3>
                  <p className="text-sm text-text-secondary">Receive promotional offers and updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="pt-4">
                <Button
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Preferences
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Settings

