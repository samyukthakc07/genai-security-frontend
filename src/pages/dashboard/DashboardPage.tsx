import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Layers,
  FileText,
  AlertCircle,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, SeverityBadge } from '@/components/ui'
import { RiskScoreBadge, RiskLevelIndicator } from '@/components/ui/RiskScoreBadge'
import { OWASP_MODULES } from '@/utils/constants'
import { formatNumber, formatRelativeTime } from '@/utils/formatters'

// Mock data for the dashboard
const DASHBOARD_STATS = {
  totalRisks: 1234,
  criticalRisks: 89,
  highRisks: 345,
  owaspCoverage: 72,
  complianceScore: 68,
  totalAssets: 156,
  activeScans: 3,
}

const RECENT_FINDINGS = [
  { id: '1', title: 'Prompt Injection detected in chatbot system', module: 'LLM01', severity: 'critical', time: '5m ago' },
  { id: '2', title: 'OpenAI API key exposed in training data', module: 'LLM02', severity: 'high', time: '12m ago' },
  { id: '3', title: 'Unsafe code generation in code assistant', module: 'LLM05', severity: 'medium', time: '1h ago' },
  { id: '4', title: 'Agent has unrestricted tool access', module: 'LLM06', severity: 'high', time: '2h ago' },
  { id: '5', title: 'Hallucination detected in financial reports', module: 'LLM09', severity: 'medium', time: '3h ago' },
]

const RECENT_SCANS = [
  { id: '1', name: 'Full GPT-4 Assessment', type: 'Full Assessment', status: 'completed', time: '10m ago' },
  { id: '2', name: 'Prompt Injection - Production', type: 'Prompt Injection', status: 'running', time: '5m ago' },
  { id: '3', name: 'RAG Security Check', type: 'Vector Security', status: 'completed', time: '1h ago' },
  { id: '4', name: 'Agent Permission Audit', type: 'Excessive Agency', status: 'failed', time: '2h ago' },
]

export function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Security Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time overview of your GenAI security posture
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/scans/quick')}>
            <Activity className="h-4 w-4" />
            Quick Scan
          </Button>
          <Button onClick={() => navigate('/reports')}>
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          icon={<Shield className="h-5 w-5" />}
          label="Total Risks"
          value={formatNumber(DASHBOARD_STATS.totalRisks)}
          color="text-gray-600"
          bg="bg-gray-100"
        />
        <StatCard
          icon={<XCircle className="h-5 w-5" />}
          label="Critical Risks"
          value={formatNumber(DASHBOARD_STATS.criticalRisks)}
          color="text-red-600"
          bg="bg-red-100"
          trend="up"
        />
        <StatCard
          icon={<AlertCircle className="h-5 w-5" />}
          label="High Risks"
          value={formatNumber(DASHBOARD_STATS.highRisks)}
          color="text-orange-600"
          bg="bg-orange-100"
          trend="up"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="OWASP Coverage"
          value={`${DASHBOARD_STATS.owaspCoverage}%`}
          color="text-green-600"
          bg="bg-green-100"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Compliance"
          value={`${DASHBOARD_STATS.complianceScore}%`}
          color="text-blue-600"
          bg="bg-blue-100"
        />
        <StatCard
          icon={<Layers className="h-5 w-5" />}
          label="AI Assets"
          value={formatNumber(DASHBOARD_STATS.totalAssets)}
          color="text-indigo-600"
          bg="bg-indigo-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OWASP Module Coverage */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>OWASP Module Coverage</CardTitle>
            <Badge variant="info">{DASHBOARD_STATS.owaspCoverage}% Covered</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {OWASP_MODULES.map((mod) => (
                <div
                  key={mod.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(mod.path)}
                >
                  <span className="text-xs font-mono font-bold text-indigo-600 w-14">{mod.number}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{mod.name}</p>
                    {/* Progress bar */}
                    <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${50 + Math.random() * 50}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{Math.floor(50 + Math.random() * 50)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right column - Findings + Scans */}
        <div className="space-y-6">
          {/* Recent Findings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Findings</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/findings')}>
                View all <ArrowUpRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {RECENT_FINDINGS.map((finding) => (
                <div
                  key={finding.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/findings/${finding.id}`)}
                >
                  <SeverityBadge severity={finding.severity} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{finding.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{finding.module} · {finding.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Scans */}
          <Card>
            <CardHeader>
              <CardTitle>Active Scans</CardTitle>
              <Badge variant="info">{DASHBOARD_STATS.activeScans} running</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {RECENT_SCANS.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/scans/${scan.id}`)}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{scan.name}</p>
                    <p className="text-xs text-gray-500">{scan.type} · {scan.time}</p>
                  </div>
                  <Badge variant={
                    scan.status === 'completed' ? 'success' :
                    scan.status === 'running' ? 'info' :
                    scan.status === 'failed' ? 'danger' : 'default'
                  }>
                    {scan.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

// Stat card sub-component
function StatCard({
  icon,
  label,
  value,
  color,
  bg,
  trend,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
  bg: string
  trend?: 'up' | 'down'
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${
            trend === 'up' ? 'text-red-500' : 'text-green-500'
          }`}>
            <ArrowUpRight className={`h-3 w-3 ${trend === 'down' && 'rotate-90'}`} />
            12%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </Card>
  )
}


