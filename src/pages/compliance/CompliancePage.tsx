import { useNavigate } from 'react-router-dom'
import {
   
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ClipboardCheck, Shield, CheckCircle2, AlertCircle, TrendingUp,
   
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Award, BookOpen, FileText, ExternalLink, ArrowUpRight,
} from 'lucide-react'
 
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Card, CardHeader, CardTitle, CardContent, Badge, SeverityBadge, Button } from '@/components/ui'
import { cn } from '@/utils/helpers'

const FRAMEWORKS = [
  {
    id: 'iso27001', name: 'ISO 27001', status: 'in_progress', score: 72,
    description: 'Information security management standard',
    controls: ['Access Control', 'Cryptography', 'Operations Security'],
    icon: <Shield className="h-5 w-5" />,
  },
  {
    id: 'soc2', name: 'SOC 2 Type II', status: 'compliant', score: 94,
    description: 'Service organization control reports',
    controls: ['Security', 'Availability', 'Confidentiality'],
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    id: 'gdpr', name: 'GDPR', status: 'compliant', score: 88,
    description: 'General Data Protection Regulation',
    controls: ['Data Processing', 'Consent Management', 'Breach Notification'],
    icon: <Award className="h-5 w-5" />,
  },
  {
    id: 'hipaa', name: 'HIPAA', status: 'in_progress', score: 65,
    description: 'Health Insurance Portability and Accountability Act',
    controls: ['Privacy Rule', 'Security Rule', 'Breach Notification'],
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: 'owasp', name: 'OWASP LLM Top 10', status: 'compliant', score: 91,
    description: 'Open Web Application Security Project - LLM',
    controls: ['LLM01-LLM10 Modules', 'Prompt Security', 'Output Handling'],
    icon: <Award className="h-5 w-5" />,
  },
  {
    id: 'nist', name: 'NIST AI RMF', status: 'pending', score: 45,
    description: 'National Institute of Standards and Technology AI RMF',
    controls: ['Govern', 'Map', 'Measure', 'Manage'],
    icon: <FileText className="h-5 w-5" />,
  },
]

export function CompliancePage() {
  const navigate = useNavigate()

  const overallScore = Math.round(FRAMEWORKS.reduce((sum, f) => sum + f.score, 0) / FRAMEWORKS.length)
  const compliantCount = FRAMEWORKS.filter((f) => f.status === 'compliant').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <ClipboardCheck className="h-4 w-4 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Compliance</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">
            Track compliance posture across security frameworks and regulations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={overallScore >= 80 ? 'success' : overallScore >= 60 ? 'warning' : 'danger'}>
            {overallScore}% Overall
          </Badge>
          <Button variant="outline" onClick={() => navigate('/reports')}>
            <FileText className="h-4 w-4" />
            Report
          </Button>
        </div>
      </div>

      {/* Overall score */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-8">
          <div className="relative">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={overallScore >= 80 ? '#16a34a' : overallScore >= 60 ? '#ea580c' : '#dc2626'}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${overallScore * 2.64} ${264 - overallScore * 2.64}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{overallScore}%</span>
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">Compliance Score</p>
            <p className="text-sm text-gray-500">
              {compliantCount} of {FRAMEWORKS.length} frameworks compliant
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Last assessed 2 days ago · Next review in 5 days
            </p>
          </div>
        </div>
      </div>

      {/* Framework cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {FRAMEWORKS.map((fw) => (
          <Card key={fw.id} hover className="transition-all hover:shadow-md" onClick={() => navigate(`/compliance/${fw.id}`)}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={cn(
                  'h-10 w-10 rounded-lg flex items-center justify-center',
                  fw.status === 'compliant' ? 'bg-green-50 text-green-600' :
                  fw.status === 'in_progress' ? 'bg-orange-50 text-orange-600' :
                  'bg-gray-50 text-gray-400'
                )}>{fw.icon}</div>
                <Badge variant={
                  fw.status === 'compliant' ? 'success' :
                  fw.status === 'in_progress' ? 'warning' : 'default'
                }>
                  {fw.status === 'in_progress' ? 'In Progress' : fw.status}
                </Badge>
              </div>

              <h3 className="text-base font-semibold text-gray-900">{fw.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{fw.description}</p>

              {/* Score bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Score</span>
                  <span className={cn(
                    'font-semibold',
                    fw.score >= 80 ? 'text-green-600' : fw.score >= 60 ? 'text-orange-600' : 'text-red-600'
                  )}>{fw.score}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      fw.score >= 80 ? 'bg-green-500' : fw.score >= 60 ? 'bg-orange-500' : 'bg-red-500'
                    )}
                    style={{ width: `${fw.score}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {fw.controls.map((c) => (
                  <span key={c} className="px-2 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-600 rounded-md">
                    {c}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
