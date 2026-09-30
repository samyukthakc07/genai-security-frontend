import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, SeverityBadge } from '@/components/ui'
import { Shield, AlertCircle, Activity, FileText, CheckCircle2, TrendingUp, Layers, XCircle, ArrowUpRight, Clock, Box, Building, FolderGit2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { dashboardMockData } from '@/data/dashboardMockData'
import { formatNumber, formatRelativeTime } from '@/utils/formatters'

export function DashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const data = dashboardMockData

  useEffect(() => {
    // Simulate slight network delay for realism
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center space-x-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
        <span className="text-gray-500">Loading dashboard...</span>
      </div>
    )
  }

  // Derived data for charts
  const severityData = [
    { name: 'Critical', value: data.overview.critical_findings, color: '#dc2626' },
    { name: 'High', value: data.overview.high_findings, color: '#ea580c' },
    { name: 'Medium', value: data.overview.medium_findings, color: '#eab308' },
    { name: 'Low', value: data.overview.low_findings, color: '#3b82f6' },
  ]

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Security Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time overview of your GenAI security posture</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/scans/quick')}>
            <Activity className="h-4 w-4 mr-2" /> Quick Scan
          </Button>
          <Button onClick={() => navigate('/reports')}>
            <FileText className="h-4 w-4 mr-2" /> Generate Report
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <StatCard icon={<Building />} label="Organizations" value={data.overview.organizations} color="text-slate-600" bg="bg-slate-100" onClick={() => navigate('/organizations')} />
        <StatCard icon={<FolderGit2 />} label="Projects" value={data.overview.active_projects} color="text-slate-600" bg="bg-slate-100" onClick={() => navigate('/projects')} />
        <StatCard icon={<Layers />} label="AI Assets" value={data.overview.ai_assets} color="text-indigo-600" bg="bg-indigo-100" onClick={() => navigate('/assets')} />
        <StatCard icon={<Activity />} label="Security Scans" value={data.overview.security_scans} color="text-blue-600" bg="bg-blue-100" onClick={() => navigate('/scans')} />
        <StatCard icon={<AlertCircle />} label="Open Findings" value={data.overview.open_findings} color="text-orange-600" bg="bg-orange-100" onClick={() => navigate('/findings')} />
        <StatCard icon={<XCircle />} label="Critical Findings" value={data.overview.critical_findings} color="text-red-600" bg="bg-red-100" />
        <StatCard icon={<Shield />} label="Avg Risk Score" value={`${data.overview.average_risk_score}/100`} color="text-gray-600" bg="bg-gray-100" />
        <StatCard icon={<CheckCircle2 />} label="Compliance" value={`${data.overview.compliance_coverage}%`} color="text-green-600" bg="bg-green-100" onClick={() => navigate('/compliance')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Executive Risk Overview */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Executive Risk Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Overall Posture</span>
                <Badge variant="danger" className="text-sm px-2.5 py-0.5">{data.executive_risk.posture}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Average Risk Score</span>
                <span className="text-xl font-bold text-gray-900">{data.overview.average_risk_score}<span className="text-sm text-gray-400">/100</span></span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-red-600 font-bold mb-1">Critical Findings</p>
                  <p className="text-3xl font-bold text-red-700">{data.overview.critical_findings}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-orange-600 font-bold mb-1">Open Findings</p>
                  <p className="text-3xl font-bold text-orange-700">{data.overview.open_findings}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-green-600 font-bold mb-1">Remediated</p>
                  <p className="text-3xl font-bold text-green-700">{data.executive_risk.remediated_findings}</p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-indigo-600 font-bold mb-1">Assets at Risk</p>
                  <p className="text-3xl font-bold text-indigo-700">{data.executive_risk.assets_requiring_attention}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Severity & Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Risk Trend & Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[250px]">
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">6-Month Risk Trend</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.risk_trend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Open Findings Severity</h4>
                <div className="flex h-full items-center">
                  <ResponsiveContainer width="50%" height="100%">
                    <PieChart>
                      <Pie data={severityData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col justify-center space-y-3 w-[50%] ml-4">
                    {severityData.map(item => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OWASP Coverage */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>OWASP LLM Top 10 Exposure</CardTitle>
              <Badge variant="info">78% Covered</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {data.owasp_modules.map((mod) => (
                <div key={mod.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all" onClick={() => navigate(mod.path)}>
                  <span className="text-xs font-mono font-bold text-indigo-600 w-12">{mod.number}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{mod.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${mod.score}%`, backgroundColor: mod.score >= 80 ? '#ef4444' : mod.score >= 50 ? '#f59e0b' : '#22c55e' }} />
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium w-8">{mod.score} pts</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <SeverityBadge severity={mod.risk.toLowerCase()} />
                    <span className="text-[10px] text-gray-500">{mod.findings} findings</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Critical Findings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>High Priority Findings</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/findings')}>View all <ArrowUpRight className="h-3 w-3 ml-1" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.critical_findings.map((finding) => (
                <div key={finding.id} className="flex items-start gap-4 p-3 rounded-lg border border-gray-100 hover:border-red-100 hover:bg-red-50/30 transition-all cursor-pointer" onClick={() => navigate('/findings')}>
                  <SeverityBadge severity={finding.severity.toLowerCase()} className="shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{finding.title}</p>
                      <span className="text-xs font-mono font-medium text-gray-500">{finding.id}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Asset: <span className="font-medium text-gray-900">{finding.asset}</span></p>
                    <div className="flex items-center gap-3">
                      <Badge variant={finding.status === 'Open' ? 'danger' : 'warning'} className="text-[10px]">
                        {finding.status}
                      </Badge>
                      <span className="text-[10px] text-gray-500 font-medium">Risk Score: {finding.score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Assets */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>AI Assets at Risk</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/assets')}>View all <ArrowUpRight className="h-3 w-3 ml-1" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.ai_assets.map(asset => (
                <div key={asset.id} className="p-3 rounded-lg border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer" onClick={() => navigate('/assets')}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{asset.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{asset.type}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{asset.model}</span>
                      </div>
                    </div>
                    <SeverityBadge severity={asset.risk.toLowerCase()} />
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <Badge variant={asset.environment === 'Production' ? 'success' : 'warning'} className="text-[10px] uppercase">
                      {asset.environment}
                    </Badge>
                    <span className="text-xs font-medium text-orange-600">{asset.open_findings} Open Findings</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Recent Scans */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Scans</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/scans')}>View all</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.recent_scans.slice(0, 4).map((scan) => (
                <div key={scan.id} className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-1.5 -mx-1.5 rounded-lg transition-colors" onClick={() => navigate('/scans')}>
                  <div className="mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{scan.type}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{scan.asset}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-400">{formatRelativeTime(scan.date)}</span>
                      <span className="text-[10px] font-medium text-indigo-600">{scan.findings_count} findings</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Compliance */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Frameworks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.compliance.map(comp => (
                <div key={comp.framework}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{comp.framework}</span>
                    <span className="text-xs font-bold text-gray-900">{comp.coverage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${comp.coverage}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {data.recent_activity.map(act => (
                <div key={act.id} className="flex gap-3">
                  <div className="mt-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-900 leading-snug">{act.text}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{formatRelativeTime(act.date)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, bg, onClick }: { icon: React.ReactNode, label: string, value: string | number, color: string, bg: string, onClick?: () => void }) {
  return (
    <div 
      className={`p-4 rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col items-center justify-center text-center transition-all ${onClick ? 'cursor-pointer hover:border-indigo-200 hover:shadow-md' : ''}`}
      onClick={onClick}
    >
      <div className={`h-8 w-8 rounded-lg ${bg} flex items-center justify-center ${color} mb-2`}>
        {React.cloneElement(icon as React.ReactElement<any>, { className: "h-4 w-4" })}
      </div>
      <p className="text-xl font-bold text-gray-900 leading-none mb-1">{value}</p>
      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{label}</p>
    </div>
  )
}
