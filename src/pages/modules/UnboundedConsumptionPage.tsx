import { useState } from 'react'
 
 
 
 
 
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Shield, Gauge, DollarSign, Activity, AlertCircle, Zap, Ban, TrendingUp, Clock, BarChart3, Loader2, Server, ShieldAlert } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, SeverityBadge, Tabs } from '@/components/ui'
 
 
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ResultsSummary, ResultsTable, ModuleStatCard, RiskScoreCard } from './components/ResultsDisplay'
 
 
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useModuleApi, type UnboundedConsumptionItem } from '@/hooks/useModuleApi'
import { formatRelativeTime, capitalize, formatNumber } from '@/utils/formatters'
import { renderSafeString } from "./components/ResultsDisplay"



export function UnboundedConsumptionPage() {
  const [activeTab, setActiveTab] = useState('usage')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tokenUsage, isLoading } = useModuleApi<any>('/unbounded-consumption/token-usage/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: dosEvents, isLoading: dosLoading } = useModuleApi<any>('/unbounded-consumption/dos-events/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rateLimits, isLoading: rateLimitsLoading } = useModuleApi<any>('/unbounded-consumption/rate-limits/')

  const usageColumns = [
    { key: 'model', label: 'Model', sortable: true, render: (v: unknown) => <span className="font-medium text-gray-900">{renderSafeString(v) || 'N/A'}</span> },
    { key: 'usage_type', label: 'Type', render: (v: unknown) => <Badge variant="info">{capitalize(String(renderSafeString(v)))}</Badge> },
    { key: 'tokens_used', label: 'Tokens', sortable: true, render: (v: unknown) => <span className="font-mono text-sm">{formatNumber(typeof v === 'number' ? v : Number(v) || 0)}</span> },
    { key: 'cost', label: 'Cost', sortable: true, render: (v: unknown) => <span className="font-medium">${(typeof v === 'number' ? v : Number(v) || 0).toFixed(2)}</span> },
    { key: 'requests_count', label: 'Requests', sortable: true, render: (v: unknown) => <span className="text-sm">{formatNumber(typeof v === 'number' ? v : Number(v) || 0)}</span> },
    { key: 'is_anomalous', label: 'Anomaly', render: (v: unknown) => v ? <Badge variant="danger">Suspicious</Badge> : <Badge variant="success">Normal</Badge> },
    { key: 'recorded_at', label: 'Time', render: (v: unknown) => <span className="text-xs text-gray-500">{formatRelativeTime(String(renderSafeString(v)))}</span> },
  ]

  const dosColumns = [
    { key: 'event_type', label: 'Event', sortable: true, render: (v: unknown) => <Badge variant="warning">{capitalize((v as string).replace(/_/g, ' '))}</Badge> },
    { key: 'severity', label: 'Severity', sortable: true, render: (v: unknown) => <SeverityBadge severity={renderSafeString(v) || 'medium'} /> },
    { key: 'status', label: 'Status', sortable: true, render: (v: unknown) => <Badge variant={v === 'mitigated' ? 'success' : v === 'investigating' ? 'warning' : 'danger'}>{capitalize(String(renderSafeString(v)))}</Badge> },
    { key: 'description', label: 'Description', render: (v: unknown) => <span className="text-xs text-gray-700 max-w-[250px] block truncate">{renderSafeString(v)}</span> },
    { key: 'detected_at', label: 'Detected', render: (v: unknown) => <span className="text-xs text-gray-500">{formatRelativeTime(String(renderSafeString(v)))}</span> },
  ]

  const rateLimitColumns = [
    { key: 'model', label: 'Model', sortable: true, render: (v: unknown) => <span className="font-medium text-gray-900">{renderSafeString(v) || 'N/A'}</span> },
    { key: 'current_rpm_limit', label: 'RPM Limit', sortable: true, render: (v: unknown) => <span className="font-mono text-sm">{formatNumber(typeof v === 'number' ? v : Number(v) || 0)}</span> },
    { key: 'current_tpm_limit', label: 'TPM Limit', render: (v: unknown) => <span className="font-mono text-sm">{formatNumber(typeof v === 'number' ? v : Number(v) || 0)}</span> },
    { key: 'peak_rpm_observed', label: 'Peak RPM', sortable: true, render: (v: unknown) => <span className="font-mono text-sm text-red-600">{formatNumber(typeof v === 'number' ? v : Number(v) || 0)}</span> },
    { key: 'rate_limiting_active', label: 'Active', render: (v: unknown) => v ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Inactive</Badge> },
    { key: 'effectiveness_score', label: 'Effectiveness', sortable: true, render: (v: unknown) => {
      const score = typeof v === 'number' ? v : Number(v) || 0
      return <div className="flex items-center gap-2"><div className="h-1.5 w-12 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: score >= 70 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444' }} /></div><span className="text-xs font-medium">{score.toFixed(0)}%</span></div>
    }},
  ]

  const totalDailyCost = 0
  const totalTodayTokens = 0
  const monthlyCost = 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-lime-100 flex items-center justify-center">
              <Gauge className="h-4 w-4 text-lime-600" />
            </div>
            <Badge variant="warning" size="sm">LLM10</Badge>
            <h1 className="text-2xl font-bold text-gray-900">Unbounded Consumption</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">Monitor token usage, control costs, detect DoS attacks, and enforce rate limits on AI systems</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModuleStatCard icon={<DollarSign className="h-5 w-5" />} label="Daily Cost" value={`$${totalDailyCost.toFixed(2)}`} color="indigo" />
        <ModuleStatCard icon={<Activity className="h-5 w-5" />} label="Tokens Today" value={formatNumber(totalTodayTokens)} color="blue" />
        <ModuleStatCard icon={<AlertCircle className="h-5 w-5" />} label="DoS Events" value={dosEvents.length} color="red" trend={dosEvents.length > 0 ? { value: 33, isUp: true } : undefined} />
        <ModuleStatCard icon={<TrendingUp className="h-5 w-5" />} label="Monthly Cost" value={`$${formatNumber(monthlyCost)}`} color="purple" />
      </div>

      {/* Cost Monitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent><div className="text-center py-6 text-sm text-gray-400">No cost data available. Usage tracking will appear here once configured.</div></CardContent></Card>
        <Card><CardContent><div className="text-center py-6 text-sm text-gray-400">No cost data available. Usage tracking will appear here once configured.</div></CardContent></Card>
        <Card><CardContent><div className="text-center py-6 text-sm text-gray-400">No cost data available. Usage tracking will appear here once configured.</div></CardContent></Card>
      </div>

      <Tabs tabs={[
        { id: 'usage', label: 'Token Usage', content: null },
        { id: 'dos', label: 'DoS Events', content: null },
        { id: 'rate-limits', label: 'Rate Limits', content: null },
      ]} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'usage' && (
        <Card>
          <CardHeader>
            <CardTitle>Token Usage Records</CardTitle>
            <Badge variant="info">{tokenUsage.filter((t) => t.is_anomalous).length} anomalies</Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                <span className="ml-2 text-sm text-gray-500">Loading token usage...</span>
              </div>
            ) : (
              <ResultsTable columns={usageColumns} data={tokenUsage as unknown as Record<string, unknown>[]} />
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'dos' && (
        <Card>
          <CardHeader>
            <CardTitle>DoS / Abuse Events</CardTitle>
            <Badge variant="danger">{dosEvents.length} events</Badge>
          </CardHeader>
          <CardContent>
            {dosLoading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading DoS events...</span></div>
            ) : (
              <ResultsTable columns={dosColumns} data={dosEvents as unknown as Record<string, unknown>[]} />
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'rate-limits' && (
        <Card>
          <CardHeader>
            <CardTitle>Rate Limit Assessments</CardTitle>
            <Badge variant="info">{rateLimits.length} assessments</Badge>
          </CardHeader>
          <CardContent>
            {rateLimitsLoading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading rate limits...</span></div>
            ) : rateLimits.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-400">No rate limit assessments found</div>
            ) : (
              <ResultsTable columns={rateLimitColumns} data={rateLimits as unknown as Record<string, unknown>[]} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
