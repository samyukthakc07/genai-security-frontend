// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  FileText, Download, Calendar, Clock, TrendingUp, Shield,
  BarChart3, PieChart, FileBarChart, FileSpreadsheet, ArrowUpRight,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CheckCircle2, AlertCircle,
} from 'lucide-react'
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui'
import { cn } from '@/utils/helpers'

const REPORT_TEMPLATES = [
  { id: 'executive', name: 'Executive Summary', icon: <FileBarChart className="h-5 w-5" />, color: 'indigo', description: 'High-level security posture overview for leadership' },
  { id: 'compliance', name: 'Compliance Report', icon: <Shield className="h-5 w-5" />, color: 'green', description: 'Detailed compliance status across all frameworks' },
  { id: 'modules', name: 'OWASP Modules Report', icon: <PieChart className="h-5 w-5" />, color: 'purple', description: 'Per-module security analysis and risk breakdown' },
  { id: 'findings', name: 'Findings Report', icon: <AlertCircle className="h-5 w-5" />, color: 'red', description: 'All open findings grouped by severity and module' },
  { id: 'trends', name: 'Trend Analysis', icon: <TrendingUp className="h-5 w-5" />, color: 'blue', description: 'Security metrics trends over time with charts' },
  { id: 'full', name: 'Full Security Audit', icon: <FileSpreadsheet className="h-5 w-5" />, color: 'teal', description: 'Comprehensive audit with all modules, findings, and recommendations' },
]

const RECENT_REPORTS = [
  { id: '1', name: 'Weekly Security Summary', type: 'Executive Summary', date: '2026-06-15', status: 'completed', pages: 12 },
  { id: '2', name: 'June Compliance Report', type: 'Compliance Report', date: '2026-06-14', status: 'completed', pages: 28 },
  { id: '3', name: 'OWASP Full Module Scan', type: 'OWASP Modules Report', date: '2026-06-13', status: 'completed', pages: 45 },
  { id: '4', name: 'Q2 Trend Analysis', type: 'Trend Analysis', date: '2026-06-10', status: 'completed', pages: 18 },
  { id: '5', name: 'Weekly Security Summary', type: 'Executive Summary', date: '2026-06-08', status: 'completed', pages: 11 },
]

const colorClasses: Record<string, { bg: string; text: string }> = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600' },
}

export function ReportsPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <FileText className="h-4 w-4 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">
            Generate and download security reports across all modules and frameworks
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <FileText className="h-4 w-4" />, label: 'Total Reports', value: '24', color: 'blue' },
          { icon: <BarChart3 className="h-4 w-4" />, label: 'Templates', value: '6', color: 'purple' },
          { icon: <Calendar className="h-4 w-4" />, label: 'This Month', value: '8', color: 'green' },
          { icon: <Download className="h-4 w-4" />, label: 'Downloads', value: '156', color: 'indigo' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={cn(
              'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
              stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
              stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
              stat.color === 'green' ? 'bg-green-50 text-green-600' :
              'bg-indigo-50 text-indigo-600'
            )}>{stat.icon}</div>
            <div>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Templates */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {REPORT_TEMPLATES.map((template) => {
            const c = colorClasses[template.color]
            return (
              <Card key={template.id} hover className="transition-all hover:shadow-md cursor-pointer" onClick={() => navigate(`/reports/new?template=${template.id}`)}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', c.bg, c.text)}>
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-300 shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Reports</h2>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {RECENT_REPORTS.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/reports/${report.id}`)}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{report.name}</p>
                  <p className="text-xs text-gray-500">{report.type} · {report.date} · {report.pages} pages</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success">Completed</Badge>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="h-4 w-4" />
                </button>
                <ArrowUpRight className="h-4 w-4 text-gray-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
