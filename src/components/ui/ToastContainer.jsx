import React from 'react'
import { useToast } from '../../context/ToastContext'
import Toast from './Toast'

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (!toasts.length) return null

  return (
    <div className="fixed top-4 right-4 z-50 w-72 max-w-full">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  )
}

export default ToastContainer

