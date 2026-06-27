'use client'

import { useState } from 'react'

export default function KYCPage() {
  const [kycData, setKycData] = useState({
    documentType: 'PASSPORT',
    documentNumber: '',
    documentExpiry: '',
    nationality: '',
    dateOfBirth: '',
  })
  const [files, setFiles] = useState<Record<string, File | null>>({
    document: null,
    selfie: null,
    addressProof: null,
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files?.[0]) {
      setFiles({
        ...files,
        [key]: e.target.files[0],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()

      formData.append('documentType', kycData.documentType)
      formData.append('documentNumber', kycData.documentNumber)
      formData.append('documentExpiry', kycData.documentExpiry)
      formData.append('nationality', kycData.nationality)
      formData.append('dateOfBirth', kycData.dateOfBirth)

      if (files.document) formData.append('document', files.document)
      if (files.selfie) formData.append('selfie', files.selfie)
      if (files.addressProof) formData.append('addressProof', files.addressProof)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        setStatus('success')
        alert('KYC submitted successfully!')
      } else {
        setStatus('error')
        alert('Failed to submit KYC')
      }
    } catch (error) {
      console.error('KYC submission failed:', error)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Know Your Customer (KYC)</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">
          Complete your KYC verification to unlock higher transaction limits and access all features.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 space-y-6">
        {/* Personal Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                value={kycData.dateOfBirth}
                onChange={(e) =>
                  setKycData({ ...kycData, dateOfBirth: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
              <input
                type="text"
                value={kycData.nationality}
                onChange={(e) => setKycData({ ...kycData, nationality: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Document Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
              <select
                value={kycData.documentType}
                onChange={(e) =>
                  setKycData({ ...kycData, documentType: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="PASSPORT">Passport</option>
                <option value="NATIONAL_ID">National ID</option>
                <option value="DRIVER_LICENSE">Driver's License</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Number</label>
              <input
                type="text"
                value={kycData.documentNumber}
                onChange={(e) =>
                  setKycData({ ...kycData, documentNumber: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                type="date"
                value={kycData.documentExpiry}
                onChange={(e) =>
                  setKycData({ ...kycData, documentExpiry: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Document Upload */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Upload</h2>
          <div className="space-y-4">
            <FileUploadField
              label="Document Photo (Passport/ID/License)"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'document')}
              fileName={files.document?.name}
            />
            <FileUploadField
              label="Selfie Photo"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'selfie')}
              fileName={files.selfie?.name}
            />
            <FileUploadField
              label="Proof of Address (Utility Bill/Bank Statement)"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange(e, 'addressProof')}
              fileName={files.addressProof?.name}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit KYC'}
        </button>
      </form>
    </div>
  )
}

function FileUploadField({
  label,
  accept,
  onChange,
  fileName,
}: {
  label: string
  accept: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileName?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition">
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          className="hidden"
          id={label}
        />
        <label htmlFor={label} className="cursor-pointer">
          <p className="text-gray-600">
            {fileName ? (
              <span className="text-green-600 font-medium">{fileName}</span>
            ) : (
              <>
                <span className="text-2xl mb-2 block">📤</span>
                Drag and drop or click to upload
              </>
            )}
          </p>
        </label>
      </div>
    </div>
  )
}
