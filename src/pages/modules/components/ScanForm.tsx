import { useState } from 'react'
import { Shield, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils/helpers'

export interface ScanFormField {
  name: string
  label: string
  type: 'textarea' | 'text' | 'select' | 'file' | 'toggle'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  rows?: number
}

interface ScanFormProps {
  title: string
  description: string
  fields: ScanFormField[]
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  isScanning?: boolean
  className?: string
}

export function ScanForm({
  title,
  description,
  fields,
  onSubmit,
  isScanning = false,
  className,
}: ScanFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const setField = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className={cn('bg-white rounded-xl border border-gray-200 p-6', className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
          <Shield className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {field.label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>

            {field.type === 'textarea' && (
              <textarea
                value={(formData[field.name] as string) || ''}
                onChange={(e) => setField(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={field.rows || 4}
                required={field.required}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
              />
            )}

            {field.type === 'text' && (
              <input
                type="text"
                value={(formData[field.name] as string) || ''}
                onChange={(e) => setField(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            )}

            {field.type === 'select' && field.options && (
              <select
                value={(formData[field.name] as string) || ''}
                onChange={(e) => setField(field.name, e.target.value)}
                required={field.required}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
              >
                <option value="">Select...</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}

            {field.type === 'toggle' && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(formData[field.name] as boolean) || false}
                  onChange={(e) => setField(field.name, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">Enable</span>
              </label>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100">
        <Button type="submit" isLoading={isScanning}>
          {isScanning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              Run Scan
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
