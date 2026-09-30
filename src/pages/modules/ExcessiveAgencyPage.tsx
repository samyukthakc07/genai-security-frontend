import { useState } from 'react'
 
 
 
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Shield, Bot, Key, CheckSquare, AlertCircle, History, UserCheck, XSquare, Loader2, Activity, Fingerprint } from 'lucide-react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Card, CardHeader, CardTitle, CardContent, Badge, SeverityBadge, Button, Tabs } from '@/components/ui'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ResultsSummary, ResultsTable, ModuleStatCard } from './components/ResultsDisplay'
 
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useModuleApi, type ExcessiveAgencyItem } from '@/hooks/useModuleApi'
 
import { formatRelativeTime, capitalize } from '@/utils/formatters'
import { renderSafeString } from "./components/ResultsDisplay"
  



export function ExcessiveAgencyPage() {
  const [activeTab, setActiveTab] = useState('permissions')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: permissions, isLoading } = useModuleApi<any>('/excessive-agency/permissions/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: approvals, isLoading: approvalsLoading } = useModuleApi<any>('/excessive-agency/approvals/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: toolLogs, isLoading: logsLoading } = useModuleApi<any>('/excessive-agency/tool-logs/')

  const permColumns = [
    { key: 'permission_name', label: 'Permission', sortable: true, render: (v: unknown) => <span className="font-medium text-gray-900">{capitalize((v as string).replace(/_/g, ' '))}</span> },
    { key: 'resource_type', label: 'Resource', sortable: true, render: (v: unknown) => <Badge variant="info">{capitalize(String(renderSafeString(v)))}</Badge> },
    { key: 'action', label: 'Action', sortable: true, render: (v: unknown) => <Badge variant="default">{capitalize(String(renderSafeString(v)))}</Badge> },
    { key: 'is_granted', label: 'Granted', render: (v: unknown) => v ? <Badge variant="success">Yes</Badge> : <Badge variant="danger">No</Badge> },
    { key: 'risk_score', label: 'Risk', sortable: true, render: (v: unknown) => {
      const score = typeof v === 'number' ? v : Number(v) || 0
      return <SeverityBadge severity={score >= 80 ? 'critical' : score >= 60 ? 'high' : 'medium'} />
    }},
    { key: 'requires_human_approval', label: 'Human Approval', render: (v: unknown) => v ? <Badge variant="warning">Required</Badge> : <Badge variant="default">Auto</Badge> },
  ]

  const approvalColumns = [
    { key: 'action_description', label: 'Action', sortable: true, render: (v: unknown) => <span className="text-sm text-gray-900 max-w-[300px] block truncate">{renderSafeString(v)}</span> },
    { key: 'status', label: 'Status', sortable: true, render: (v: unknown) => <Badge variant={v === 'approved' ? 'success' : v === 'rejected' ? 'danger' : 'warning'}>{capitalize(String(renderSafeString(v)))}</Badge> },
    { key: 'risk_assessment', label: 'Risk Level', render: (v: unknown, row: Record<string, unknown>) => {
      const assessment = v as Record<string, unknown> | undefined
      return <SeverityBadge severity={((assessment?.risk_level as string) || row.risk_level as string) || 'medium'} />
    }},
    { key: 'created_at', label: 'Requested', render: (v: unknown) => <span className="text-xs text-gray-500">{formatRelativeTime(String(renderSafeString(v)))}</span> },
  ]

  const toolColumns = [
    { key: 'tool_name', label: 'Tool', sortable: true, render: (v: unknown) => <span className="font-medium text-gray-900">{capitalize((v as string).replace(/_/g, ' '))}</span> },
    { key: 'action_performed', label: 'Action', render: (v: unknown) => <span className="text-xs text-gray-700 max-w-[300px] block truncate">{renderSafeString(v)}</span> },
    { key: 'status', label: 'Status', sortable: true, render: (v: unknown) => <Badge variant={v === 'allowed' ? 'success' : v === 'blocked' ? 'danger' : 'warning'}>{capitalize(String(renderSafeString(v)))}</Badge> },
    { key: 'risk_level', label: 'Risk', sortable: true, render: (v: unknown) => <SeverityBadge severity={renderSafeString(v) || 'medium'} /> },
    { key: 'executed_at', label: 'Time', render: (v: unknown) => <span className="text-xs text-gray-500">{formatRelativeTime(String(renderSafeString(v)))}</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-100 flex items-center justify-center">
              <Bot className="h-4 w-4 text-cyan-600" />
            </div>
            <Badge variant="warning" size="sm">LLM06</Badge>
            <h1 className="text-2xl font-bold text-gray-900">Excessive Agency</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">Manage AI agent permissions, monitor tool usage, and enforce human-in-the-loop approvals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModuleStatCard icon={<Key className="h-5 w-5" />} label="Permissions" value={permissions.length} color="indigo" />
        <ModuleStatCard icon={<CheckSquare className="h-5 w-5" />} label="Pending Approvals" value={approvals.filter((a) => a.status === 'pending').length} color="orange" />
        <ModuleStatCard icon={<UserCheck className="h-5 w-5" />} label="Approved" value={approvals.filter((a) => a.status === 'approved').length} color="green" />
        <ModuleStatCard icon={<XSquare className="h-5 w-5" />} label="Blocked Actions" value={toolLogs.filter((t) => t.status === 'blocked').length} color="red" trend={{ value: 5, isUp: false }} />
      </div>

      <Tabs tabs={[
        { id: 'permissions', label: 'Agent Permissions', content: null },
        { id: 'approvals', label: 'Action Approvals', content: null },
        { id: 'logs', label: 'Tool Access Logs', content: null },
      ]} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'permissions' && (
        <Card>
          <CardHeader>
            <CardTitle>Agent Permissions</CardTitle>
            <Badge variant="info">{permissions.length} permissions</Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                <span className="ml-2 text-sm text-gray-500">Loading permissions...</span>
              </div>
            ) : (
              <ResultsTable columns={permColumns} data={permissions as unknown as Record<string, unknown>[]} />
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'approvals' && (
        <Card>
          <CardHeader>
            <CardTitle>Action Approvals</CardTitle>
            <Badge variant="info">{approvals.length} approvals</Badge>
          </CardHeader>
          <CardContent>
            {approvalsLoading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading approvals...</span></div>
            ) : (
              <ResultsTable columns={approvalColumns} data={approvals as unknown as Record<string, unknown>[]} />
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'logs' && (
        <Card>
          <CardHeader>
            <CardTitle>Tool Access Logs</CardTitle>
            <Badge variant="info">{toolLogs.length} events</Badge>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading tool logs...</span></div>
            ) : (
              <ResultsTable columns={toolColumns} data={toolLogs as unknown as Record<string, unknown>[]} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
