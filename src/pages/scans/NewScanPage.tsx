import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Shield, Cpu, Activity, Settings, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui'
import { aiAssetsMockData } from '@/data/aiAssetsMockData'

export function NewScanPage() {
  const navigate = useNavigate()
  const [isScanning, setIsScanning] = useState(false)
  const [scanType, setScanType] = useState('full')
  const [selectedAsset, setSelectedAsset] = useState(aiAssetsMockData.agents[0].id)

  const handleStartScan = () => {
    setIsScanning(true)
    // Simulate scan initiation delay
    setTimeout(() => {
      // For demo purposes, we'll route back to the scans list.
      navigate('/scans')
    }, 1500)
  }

  const allAssets = [
    ...aiAssetsMockData.agents,
    ...aiAssetsMockData.models,
    ...aiAssetsMockData['rag-systems'],
  ]

  return (
    <div className="space-y-6 max-w-4xl pb-12 mt-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configure New Scan</h1>
          <p className="text-sm text-gray-500 mt-1">Set up a new automated security assessment.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-500" /> Target Asset
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Select the AI asset or model you want to evaluate.</p>
                <select 
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                >
                  <optgroup label="AI Agents">
                    {aiAssetsMockData.agents.map(a => (
                      <option key={a.id} value={a.id}>{a.name} (Agent)</option>
                    ))}
                  </optgroup>
                  <optgroup label="Models">
                    {aiAssetsMockData.models.map(m => (
                      <option key={m.id} value={m.id}>{m.name} (Model)</option>
                    ))}
                  </optgroup>
                  <optgroup label="RAG Systems">
                    {aiAssetsMockData['rag-systems'].map(r => (
                      <option key={r.id} value={r.id}>{r.name} (RAG)</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4 text-indigo-500" /> Assessment Type
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${scanType === 'full' ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-200 hover:border-indigo-200'}`}
                  onClick={() => setScanType('full')}
                >
                  <Shield className={`h-5 w-5 mb-2 ${scanType === 'full' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <h4 className="text-sm font-bold text-gray-900">Comprehensive Scan</h4>
                  <p className="text-xs text-gray-500 mt-1">Full OWASP Top 10 evaluation covering all applicable threat vectors.</p>
                </div>
                <div 
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${scanType === 'quick' ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-200 hover:border-indigo-200'}`}
                  onClick={() => setScanType('quick')}
                >
                  <Activity className={`h-5 w-5 mb-2 ${scanType === 'quick' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <h4 className="text-sm font-bold text-gray-900">Quick Scan</h4>
                  <p className="text-xs text-gray-500 mt-1">Rapid assessment focusing on high-risk vectors like Prompt Injection.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-100 bg-gray-50">
              <CardTitle className="text-sm font-semibold">Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Target</span>
                <span className="font-medium text-gray-900 truncate max-w-[120px]">{allAssets.find(a => a.id === selectedAsset)?.name || 'Unknown'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Type</span>
                <span className="font-medium text-gray-900">{scanType === 'full' ? 'Comprehensive' : 'Quick'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Est. Time</span>
                <span className="font-medium text-gray-900">{scanType === 'full' ? '~5 mins' : '~1 min'}</span>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleStartScan}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <><Activity className="h-4 w-4 mr-2 animate-pulse" /> Initiating...</>
                  ) : (
                    <><Play className="h-4 w-4 mr-2 fill-current" /> Start Assessment</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 text-xs leading-relaxed">
            <h4 className="font-bold flex items-center gap-1.5 mb-1"><Activity className="h-3.5 w-3.5" /> Demo Environment</h4>
            <p>This is a demonstration environment. Initiating a scan will simulate a highly realistic assessment for presentation purposes without sending traffic to actual models.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
