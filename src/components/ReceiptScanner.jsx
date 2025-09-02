import React, { useState, useRef } from 'react'
import { Camera, Upload, X, Check, Loader } from 'lucide-react'
import { categorizeExpense } from '../services/openai'
import Card from './ui/Card'
import Button from './ui/Button'

function ReceiptScanner({ trip, onScanComplete, onClose }) {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scanResult, setScanResult] = useState(null)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraToggle = async () => {
    if (cameraActive) {
      // Stop the camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
      setCameraActive(false)
    } else {
      // Start the camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setCameraActive(true)
      } catch (err) {
        setError('Could not access camera: ' + err.message)
      }
    }
  }

  const captureImage = () => {
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    canvas.toBlob(blob => {
      setImage(blob)
      setPreview(canvas.toDataURL('image/jpeg'))
      // Stop the camera after capturing
      handleCameraToggle()
    }, 'image/jpeg')
  }

  const handleScan = async () => {
    if (!image) return

    setLoading(true)
    setError('')
    
    try {
      // In a real application, this would call an OCR service like Google Cloud Vision
      // For this demo, we'll simulate OCR with a timeout and mock data
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock OCR result
      const mockOcrResult = {
        description: 'Dinner at Local Restaurant',
        amount: Math.floor(Math.random() * 100) + 20,
        date: new Date().toISOString().split('T')[0]
      }
      
      // Use OpenAI to categorize the expense
      const categoryId = await categorizeExpense(
        mockOcrResult.description, 
        trip.expenseCategories
      )
      
      setScanResult({
        ...mockOcrResult,
        categoryId
      })
    } catch (err) {
      setError('Failed to scan receipt: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    onScanComplete(scanResult)
    onClose()
  }

  const handleReset = () => {
    setImage(null)
    setPreview(null)
    setScanResult(null)
    setError('')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Receipt Scanner</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <X size={20} />
          </button>
        </div>

        {!scanResult ? (
          <>
            <div className="mb-6">
              {!preview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {cameraActive ? (
                    <div className="relative">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full rounded-lg"
                      />
                      <Button
                        variant="primary"
                        onClick={captureImage}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                      >
                        Capture
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-text-secondary">
                        Upload a receipt image or take a photo
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button
                          variant="secondary"
                          onClick={() => fileInputRef.current.click()}
                          className="flex items-center gap-2"
                        >
                          <Upload size={18} />
                          Upload
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={handleCameraToggle}
                          className="flex items-center gap-2"
                        >
                          <Camera size={18} />
                          Camera
                        </Button>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={preview} 
                    alt="Receipt preview" 
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleScan}
                disabled={!image || loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    Scan Receipt
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800 flex items-center gap-2 mb-2">
                <Check size={18} className="text-green-600" />
                Receipt Scanned Successfully
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-text-secondary">Description</p>
                  <p className="font-medium text-text-primary">{scanResult.description}</p>
                </div>
                
                <div>
                  <p className="text-sm text-text-secondary">Amount</p>
                  <p className="font-medium text-text-primary">
                    {trip.currency} {scanResult.amount.toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-text-secondary">Category</p>
                  <p className="font-medium text-text-primary">
                    {trip.expenseCategories.find(c => c.categoryId === scanResult.categoryId)?.categoryName}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-text-secondary">Date</p>
                  <p className="font-medium text-text-primary">{scanResult.date}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={handleReset}
              >
                Scan Another
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                className="flex items-center gap-2"
              >
                <Check size={18} />
                Confirm & Add
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default ReceiptScanner

