import { useState } from 'react'
import { Shield, Boxes, Package, AlertCircle, FileJson, GitBranch, ExternalLink, Loader2, ShieldCheck, Activity, Fingerprint } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, SeverityBadge, Tabs } from '@/components/ui'
import { ResultsSummary, ResultsTable, ModuleStatCard, RiskScoreCard } from './components/ResultsDisplay'
import { useModuleApi, type SupplyChainItem } from '@/hooks/useModuleApi'
import { formatRelativeTime, capitalize } from '@/utils/formatters'



export function SupplyChainPage() {
  const [activeTab, setActiveTab] = useState('sbom')

  const { data: sboms, isLoading: sbomsLoading } = useModuleApi<SBOMItem>('/supply-chain/sboms/')
  const { data: dependencies, isLoading } = useModuleApi<SupplyChainItem>('/supply-chain/dependencies/')
  const { data: sdkAssessments, isLoading: sdkLoading } = useModuleApi<SDKItem>('/supply-chain/sdk-assessments/')

  const depColumns = [
    { key: 'dependency_name', label: 'Package', sortable: true },
    { key: 'dependency_version', label: 'Version', sortable: true },
    { key: 'dependency_type', label: 'Type', sortable: true, render: (v: unknown) => <span className="text-xs text-gray-600">{v as string}</span> },
    { key: 'known_vulnerabilities', label: 'Vulnerabilities', render: (v: unknown) => {
      const vulns = Array.isArray(v) ? v : []
      return <SeverityBadge severity={vulns.length === 0 ? 'low' : vulns.length >= 3 ? 'critical' : 'high'} />
    }},
    { key: 'risk_level', label: 'Risk Level', sortable: true, render: (v: unknown) => <SeverityBadge severity={v as string || 'none'} /> },
    { key: 'is_outdated', label: 'Outdated', render: (v: unknown) => v ? <Badge variant="warning">Yes</Badge> : <Badge variant="success">No</Badge> },
  ]

  const totalVulns = dependencies.reduce((a, d) => {
    const vulns = Array.isArray(d.known_vulnerabilities) ? d.known_vulnerabilities : []
    return a + vulns.length
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Boxes className="h-4 w-4 text-amber-600" />
            </div>
            <Badge variant="warning" size="sm">LLM03</Badge>
            <h1 className="text-2xl font-bold text-gray-900">Supply Chain Security</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">Assess and monitor AI model supply chain vulnerabilities, dependencies, and third-party risks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModuleStatCard icon={<FileJson className="h-5 w-5" />} label="AI SBOMs" value={sboms.length} color="indigo" />
        <ModuleStatCard icon={<Package className="h-5 w-5" />} label="Dependencies" value={dependencies.length} color="blue" />
        <ModuleStatCard icon={<AlertCircle className="h-5 w-5" />} label="Vulnerabilities" value={totalVulns} color="red" trend={totalVulns > 0 ? { value: 15, isUp: true } : undefined} />
        <ModuleStatCard icon={<GitBranch className="h-5 w-5" />} label="Outdated" value={dependencies.filter((d) => d.is_outdated).length} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {sboms.slice(0, 3).map((sbom) => (
          <RiskScoreCard key={sbom.id} score={sbom.risk_score} label={`${sbom.model} - Risk Score`} />
        ))}
      </div>

      <Tabs tabs={[
        { id: 'sbom', label: 'AI SBOMs', content: null },
        { id: 'dependencies', label: 'Dependencies', content: null },
        { id: 'sdk', label: 'SDK Risk Assessment', content: null },
      ]} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'sbom' && (
        <Card>
          <CardHeader>
            <CardTitle>Software Bill of Materials</CardTitle>
            <Badge variant="info">{sboms.length} SBOMs</Badge>
          </CardHeader>
          <CardContent>
            {sbomsLoading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading SBOMs...</span></div>
            ) : (
              <div className="space-y-3">
                {sboms.map((sbom) => (
                  <div key={sbom.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sbom.model}</p>
                      <p className="text-xs text-gray-500">v{sbom.sbom_version} | {sbom.format} | {sbom.components} components</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <SeverityBadge severity={sbom.risk_score >= 70 ? 'critical' : sbom.risk_score >= 40 ? 'high' : 'medium'} />
                      <span className="text-xs text-gray-500">{sbom.vulnerabilities} vulns</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'dependencies' && (
        <Card>
          <CardHeader>
            <CardTitle>Dependency Scan Results</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                <span className="ml-2 text-sm text-gray-500">Loading dependencies...</span>
              </div>
            ) : (
              <ResultsTable columns={depColumns} data={dependencies as unknown as Record<string, unknown>[]} />
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'sdk' && (
        <Card>
          <CardHeader>
            <CardTitle>SDK Risk Assessments</CardTitle>
            <Badge variant="info">{sdkAssessments.length} SDKs</Badge>
          </CardHeader>
          <CardContent>
            {sdkLoading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading SDK assessments...</span></div>
            ) : (
              <div className="space-y-3">
                {sdkAssessments.map((sdk) => (
                  <div key={sdk.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{sdk.sdk_name}</span>
                        <span className="text-xs text-gray-400">v{sdk.sdk_version}</span>
                        <span className="text-xs text-gray-400">|</span>
                        <span className="text-xs text-gray-500">{sdk.provider}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {sdk.permissions_required?.map((p: string) => (
                          <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-medium">{p}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{sdk.risk_score}</p>
                        <p className="text-[10px] text-gray-500">Risk</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold" style={{ color: sdk.security_score >= 70 ? '#16a34a' : '#ea580c' }}>{sdk.security_score}</p>
                        <p className="text-[10px] text-gray-500">Security</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
