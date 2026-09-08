import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Activity, Clock, CheckCircle2, XCircle, AlertCircle,
  Play, ArrowUpRight, Search,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui'
import { cn } from '@/utils/helpers'
import scanService from '@/services/scanService'



export function ScansPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [liveScans, setLiveScans] = useState<any[]>([])

  useEffect(() => {
    scanService.list()
      .then(data => {
        setLiveScans(data)
      })
      .catch(err => {
        console.error('Failed to fetch scans from backend:', err)
      })
  }, [])

  const formattedLiveScans = liveScans.map((s: any) => ({
    id: s.id,
    name: s.name,
    type: s.scan_type_display || s.scan_type,
    status: s.status,
    progress: Math.round(parseFloat(s.progress) || s.progress || 0),
    risk: s.findings_count > 0 ? 'high' : 'low',
    findings: s.findings_count || 0,
    time: s.created_at ? new Date(s.created_at).toLocaleDateString() : 'Just now'
  }))

  const displayScans = formattedLiveScans

  const totalScans = displayScans.length
  const activeScans = displayScans.filter((s) => s.status === 'running').length
  const failedScans = displayScans.filter((s) => s.status === 'failed').length
  const completedScans = displayScans.filter((s) => s.status === 'completed').length

  const filteredScans = displayScans.filter((s) =>
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Shield className="h-4 w-4 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AI Security Scans</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">
            Run and monitor security scans across all your AI assets and OWASP modules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/scans/quick')}>
            <Activity className="h-4 w-4" />
            Quick Scan
          </Button>
          <Button onClick={() => navigate('/scans/new')}>
            <Play className="h-4 w-4" />
            New Scan
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Play className="h-4 w-4" />, label: 'Total Scans', value: String(totalScans), color: 'blue' },
          { icon: <Activity className="h-4 w-4" />, label: 'Active', value: String(activeScans), color: 'green' },
          { icon: <AlertCircle className="h-4 w-4" />, label: 'Failed', value: String(failedScans), color: 'red' },
          { icon: <CheckCircle2 className="h-4 w-4" />, label: 'Completed', value: String(completedScans), color: 'indigo' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={cn(
              'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
              stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
              stat.color === 'green' ? 'bg-green-50 text-green-600' :
              stat.color === 'red' ? 'bg-red-50 text-red-600' :
              'bg-indigo-50 text-indigo-600'
            )}>{stat.icon}</div>
            <div>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search scans..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Scans List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="divide-y divide-gray-100">
          {filteredScans.map((scan) => (
            <div
              key={scan.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/scans/${scan.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'h-10 w-10 rounded-lg flex items-center justify-center',
                  scan.status === 'completed' ? 'bg-green-50 text-green-600' :
                  scan.status === 'running' ? 'bg-blue-50 text-blue-600' :
                  scan.status === 'failed' ? 'bg-red-50 text-red-600' :
                  'bg-gray-50 text-gray-400'
                )}>
                  {scan.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> :
                   scan.status === 'running' ? <Activity className="h-5 w-5 animate-spin" /> :
                   scan.status === 'failed' ? <XCircle className="h-5 w-5" /> :
                   <Clock className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{scan.name}</p>
                  <p className="text-xs text-gray-500">{scan.type} · {scan.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Progress bar for running scans */}
                {scan.status === 'running' && (
                  <div className="w-24">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${scan.progress}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5 text-right">{scan.progress}%</p>
                  </div>
                )}

                {scan.findings > 0 && (
                  <span className="text-xs text-gray-500">{scan.findings} findings</span>
                )}

                <Badge variant={
                  scan.status === 'completed' ? 'success' :
                  scan.status === 'running' ? 'info' :
                  scan.status === 'failed' ? 'danger' : 'default'
                }>
                  {scan.status}
                </Badge>

                <ArrowUpRight className="h-4 w-4 text-gray-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
